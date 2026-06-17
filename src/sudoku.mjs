import { SUDOKU_PUZZLES } from "./sudokuPuzzles.mjs";

export const SIZE = 6;
export const BOX_ROWS = 2;
export const BOX_COLS = 3;

export const SUDOKU_SETTINGS = {
  6: {
    size: 6,
    boxRows: 2,
    boxCols: 3,
  },
  9: {
    size: 9,
    boxRows: 3,
    boxCols: 3,
  },
};

function cloneGrid(grid) {
  return grid.map((row) => [...row]);
}

function key(row, col) {
  return `${row},${col}`;
}

function resolveSettings(options = {}) {
  const size = typeof options === "number" ? 6 : Number(options.size || 6);
  return SUDOKU_SETTINGS[size] || SUDOKU_SETTINGS[6];
}

function stringToGrid(value, size) {
  return Array.from({ length: size }, (_, row) => (
    value
      .slice(row * size, row * size + size)
      .split("")
      .map(Number)
  ));
}

function createPuzzleRecord(record, size) {
  return {
    level: record.level,
    size,
    boxRows: SUDOKU_SETTINGS[size].boxRows,
    boxCols: SUDOKU_SETTINGS[size].boxCols,
    difficulty: record.difficulty,
    puzzle: stringToGrid(record.puzzle, size),
    solution: stringToGrid(record.solution, size),
  };
}

function createGivens(puzzle) {
  return new Set(puzzle.flatMap((row, rowIndex) => row.map((value, colIndex) => (
    value === 0 ? null : key(rowIndex, colIndex)
  ))).filter(Boolean));
}

function groupIsValid(values, settings) {
  return values.length === settings.size
    && new Set(values).size === settings.size
    && values.every((value) => value >= 1 && value <= settings.size);
}

function canPlace(grid, row, col, value, settings) {
  for (let index = 0; index < settings.size; index += 1) {
    if (grid[row][index] === value || grid[index][col] === value) return false;
  }

  const rowStart = Math.floor(row / settings.boxRows) * settings.boxRows;
  const colStart = Math.floor(col / settings.boxCols) * settings.boxCols;
  for (let r = rowStart; r < rowStart + settings.boxRows; r += 1) {
    for (let c = colStart; c < colStart + settings.boxCols; c += 1) {
      if (grid[r][c] === value) return false;
    }
  }
  return true;
}

function solveInternal(puzzle, settings, limit = 1) {
  const grid = cloneGrid(puzzle);
  const solutions = [];

  function solve() {
    if (solutions.length >= limit) return;
    let best = null;
    let bestCandidates = null;

    for (let row = 0; row < settings.size; row += 1) {
      for (let col = 0; col < settings.size; col += 1) {
        if (grid[row][col] !== 0) continue;
        const candidates = [];
        for (let value = 1; value <= settings.size; value += 1) {
          if (canPlace(grid, row, col, value, settings)) candidates.push(value);
        }
        if (candidates.length === 0) return;
        if (!bestCandidates || candidates.length < bestCandidates.length) {
          best = { row, col };
          bestCandidates = candidates;
        }
      }
    }

    if (!best) {
      solutions.push(cloneGrid(grid));
      return;
    }

    for (const value of bestCandidates) {
      grid[best.row][best.col] = value;
      solve();
      grid[best.row][best.col] = 0;
    }
  }

  solve();
  return solutions;
}

function findPuzzleRecord(size, level, difficulty) {
  const puzzles = SUDOKU_PUZZLES[size] || SUDOKU_PUZZLES[6];
  if (Number.isInteger(level)) {
    return puzzles[Math.min(Math.max(level, 1), puzzles.length) - 1];
  }
  if (difficulty) {
    return puzzles.find((puzzle) => puzzle.difficulty === difficulty) || puzzles[0];
  }
  return puzzles[0];
}

export function createSudokuGame(options = {}) {
  const size = typeof options === "number" ? 6 : Number(options.size || 6);
  const record = findPuzzleRecord(size, options.level, options.difficulty);
  const puzzle = createPuzzleRecord(record, SUDOKU_SETTINGS[size] ? size : 6);

  return {
    ...puzzle,
    maxLevel: (SUDOKU_PUZZLES[puzzle.size] || []).length,
    entries: cloneGrid(puzzle.puzzle),
    givens: createGivens(puzzle.puzzle),
  };
}

export function solveSudoku(puzzle, options = {}) {
  const settings = resolveSettings(options);
  return solveInternal(puzzle, settings, 1)[0] || null;
}

export function listSudokuPuzzles(size = 6) {
  const safeSize = SUDOKU_SETTINGS[size] ? Number(size) : 6;
  return (SUDOKU_PUZZLES[safeSize] || []).map((record) => createPuzzleRecord(record, safeSize));
}

export function isValidSolution(grid, options = {}) {
  const settings = resolveSettings(options);
  for (let row = 0; row < settings.size; row += 1) {
    if (!groupIsValid(grid[row], settings)) return false;
  }

  for (let col = 0; col < settings.size; col += 1) {
    const values = grid.map((row) => row[col]);
    if (!groupIsValid(values, settings)) return false;
  }

  for (let rowStart = 0; rowStart < settings.size; rowStart += settings.boxRows) {
    for (let colStart = 0; colStart < settings.size; colStart += settings.boxCols) {
      const values = [];
      for (let row = rowStart; row < rowStart + settings.boxRows; row += 1) {
        for (let col = colStart; col < colStart + settings.boxCols; col += 1) {
          values.push(grid[row][col]);
        }
      }
      if (!groupIsValid(values, settings)) return false;
    }
  }

  return true;
}

export function findConflicts(grid, givens = new Set(), options = {}) {
  const settings = resolveSettings(options);
  const conflicts = new Set();

  function markDuplicates(cells) {
    const seen = new Map();
    cells.forEach(({ row, col, value }) => {
      if (!value) return;
      if (!seen.has(value)) {
        seen.set(value, []);
      }
      seen.get(value).push({ row, col });
    });

    for (const matches of seen.values()) {
      if (matches.length > 1) {
        matches.forEach(({ row, col }) => conflicts.add(key(row, col)));
      }
    }
  }

  for (let row = 0; row < settings.size; row += 1) {
    markDuplicates(grid[row].map((value, col) => ({ row, col, value })));
  }

  for (let col = 0; col < settings.size; col += 1) {
    markDuplicates(grid.map((rowValues, row) => ({ row, col, value: rowValues[col] })));
  }

  for (let rowStart = 0; rowStart < settings.size; rowStart += settings.boxRows) {
    for (let colStart = 0; colStart < settings.size; colStart += settings.boxCols) {
      const cells = [];
      for (let row = rowStart; row < rowStart + settings.boxRows; row += 1) {
        for (let col = colStart; col < colStart + settings.boxCols; col += 1) {
          cells.push({ row, col, value: grid[row][col] });
        }
      }
      markDuplicates(cells);
    }
  }

  for (const given of givens) {
    const [row, col] = given.split(",").map(Number);
    if (!grid[row][col]) conflicts.add(given);
  }

  return conflicts;
}

export function isSolved(grid, solution, givens = new Set(), options = {}) {
  const settings = resolveSettings(options);
  if (findConflicts(grid, givens, settings).size > 0) return false;
  for (let row = 0; row < settings.size; row += 1) {
    for (let col = 0; col < settings.size; col += 1) {
      if (grid[row][col] !== solution[row][col]) return false;
    }
  }
  return true;
}

export function cellKey(row, col) {
  return key(row, col);
}
