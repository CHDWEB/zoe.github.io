export const SIZE = 6;
export const BOX_ROWS = 2;
export const BOX_COLS = 3;

export const SUDOKU_SETTINGS = {
  6: {
    size: 6,
    boxRows: 2,
    boxCols: 3,
    givens: {
      simple: { min: 24, max: 28 },
      normal: { min: 18, max: 23 },
      challenge: { min: 14, max: 17 },
    },
  },
  9: {
    size: 9,
    boxRows: 3,
    boxCols: 3,
    givens: {
      simple: { min: 40, max: 45 },
      normal: { min: 32, max: 39 },
      challenge: { min: 26, max: 31 },
    },
  },
};

function cloneGrid(grid) {
  return grid.map((row) => [...row]);
}

function key(row, col) {
  return `${row},${col}`;
}

function randomSeed() {
  return Math.floor(Math.random() * 0x7fffffff) + 1;
}

function seededRandom(seed = randomSeed()) {
  let value = seed % 0x7fffffff;
  if (value <= 0) value += 0x7ffffffe;
  return () => {
    value = (value * 48271) % 0x7fffffff;
    return value / 0x7fffffff;
  };
}

function pickIndex(length, random = Math.random) {
  return Math.floor(random() * length);
}

function shuffle(items, random = Math.random) {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = pickIndex(i + 1, random);
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function resolveSettings(options = {}) {
  const size = typeof options === "number" ? 6 : Number(options.size || 6);
  const settings = SUDOKU_SETTINGS[size] || SUDOKU_SETTINGS[6];
  return {
    ...settings,
    difficulty: typeof options === "number" ? "simple" : (options.difficulty || "simple"),
    random: typeof options === "number" ? seededRandom(options + 1) : (options.random || Math.random),
  };
}

function groupIsValid(values, settings) {
  return values.length === settings.size
    && new Set(values).size === settings.size
    && values.every((value) => value >= 1 && value <= settings.size);
}

function buildSolvedGrid(settings, random = Math.random) {
  const { size, boxRows, boxCols } = settings;
  const rows = shuffle([...Array(size).keys()], random);
  const cols = shuffle([...Array(size).keys()], random);
  const numbers = shuffle([...Array(size).keys()].map((index) => index + 1), random);

  const rowBands = shuffle([...Array(size / boxRows).keys()], random)
    .flatMap((band) => shuffle([...Array(boxRows).keys()], random).map((row) => band * boxRows + row));
  const colBands = shuffle([...Array(size / boxCols).keys()], random)
    .flatMap((band) => shuffle([...Array(boxCols).keys()], random).map((col) => band * boxCols + col));

  const rowOrder = rowBands.length === size ? rowBands : rows;
  const colOrder = colBands.length === size ? colBands : cols;

  return rowOrder.map((row) => colOrder.map((col) => {
    const pattern = (boxCols * (row % boxRows) + Math.floor(row / boxRows) + col) % size;
    return numbers[pattern];
  }));
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

function countSolutions(puzzle, settings) {
  return solveInternal(puzzle, settings, 2).length;
}

function targetGivenCount(settings, random) {
  const range = settings.givens[settings.difficulty] || settings.givens.simple;
  return range.min + pickIndex(range.max - range.min + 1, random);
}

function removeCells(solution, settings, random) {
  const puzzle = cloneGrid(solution);
  const cells = shuffle([...Array(settings.size * settings.size).keys()], random);
  const target = targetGivenCount(settings, random);
  let givens = settings.size * settings.size;

  for (const cell of cells) {
    if (givens <= target) break;
    const row = Math.floor(cell / settings.size);
    const col = cell % settings.size;
    const previous = puzzle[row][col];
    puzzle[row][col] = 0;

    if (countSolutions(puzzle, settings) === 1) {
      givens -= 1;
    } else {
      puzzle[row][col] = previous;
    }
  }

  return puzzle;
}

function createGivens(puzzle) {
  return new Set(puzzle.flatMap((row, rowIndex) => row.map((value, colIndex) => (
    value === 0 ? null : key(rowIndex, colIndex)
  ))).filter(Boolean));
}

export function createSudokuGame(options = {}) {
  const settings = resolveSettings(options);
  let puzzle = null;
  let solution = null;

  for (let attempt = 0; attempt < 12; attempt += 1) {
    solution = buildSolvedGrid(settings, settings.random);
    puzzle = removeCells(solution, settings, settings.random);
    const givens = puzzle.flat().filter(Boolean).length;
    const range = settings.givens[settings.difficulty] || settings.givens.simple;
    if (givens >= range.min && givens <= range.max && countSolutions(puzzle, settings) === 1) break;
  }

  return {
    size: settings.size,
    boxRows: settings.boxRows,
    boxCols: settings.boxCols,
    difficulty: settings.difficulty,
    puzzle,
    solution,
    entries: cloneGrid(puzzle),
    givens: createGivens(puzzle),
  };
}

export function solveSudoku(puzzle, options = {}) {
  const settings = resolveSettings(options);
  return solveInternal(puzzle, settings, 1)[0] || null;
}

export function listSudokuPuzzles() {
  return [];
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
