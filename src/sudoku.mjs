export const SIZE = 6;
export const BOX_ROWS = 2;
export const BOX_COLS = 3;

const PUZZLES = [
  { id: "simple-1", difficulty: "simple", puzzle: [[1,2,0,5,4,3],[4,0,3,2,1,0],[2,3,4,6,5,1],[5,6,1,3,0,4],[0,0,2,0,3,0],[3,1,5,4,0,0]], solution: [[1,2,6,5,4,3],[4,5,3,2,1,6],[2,3,4,6,5,1],[5,6,1,3,2,4],[6,4,2,1,3,5],[3,1,5,4,6,2]] },
  { id: "simple-2", difficulty: "simple", puzzle: [[1,0,5,3,2,6],[0,3,2,0,0,1],[0,0,3,1,4,0],[2,0,0,0,3,5],[3,0,1,5,6,4],[4,5,6,2,1,3]], solution: [[1,4,5,3,2,6],[6,3,2,4,5,1],[5,6,3,1,4,2],[2,1,4,6,3,5],[3,2,1,5,6,4],[4,5,6,2,1,3]] },
  { id: "simple-3", difficulty: "simple", puzzle: [[3,1,6,0,0,5],[0,2,0,0,1,3],[6,3,2,1,5,4],[4,0,1,2,3,6],[0,6,0,3,4,1],[1,0,0,0,6,0]], solution: [[3,1,6,4,2,5],[5,2,4,6,1,3],[6,3,2,1,5,4],[4,5,1,2,3,6],[2,6,5,3,4,1],[1,4,3,5,6,2]] },
  { id: "simple-4", difficulty: "simple", puzzle: [[3,6,0,4,1,2],[0,0,0,5,6,3],[4,3,1,6,2,0],[5,2,6,0,0,4],[6,4,0,0,0,1],[1,5,3,2,4,6]], solution: [[3,6,5,4,1,2],[2,1,4,5,6,3],[4,3,1,6,2,5],[5,2,6,1,3,4],[6,4,2,3,5,1],[1,5,3,2,4,6]] },
  { id: "simple-5", difficulty: "simple", puzzle: [[3,2,6,0,5,4],[5,1,4,2,3,0],[0,0,0,4,2,3],[2,0,3,0,1,5],[6,0,1,5,4,2],[4,0,0,3,0,1]], solution: [[3,2,6,1,5,4],[5,1,4,2,3,6],[1,6,5,4,2,3],[2,4,3,6,1,5],[6,3,1,5,4,2],[4,5,2,3,6,1]] },
  { id: "simple-6", difficulty: "simple", puzzle: [[0,2,0,0,3,0],[4,3,5,0,2,6],[5,1,0,6,4,3],[0,4,0,5,1,2],[3,5,0,2,0,0],[2,6,4,3,5,0]], solution: [[1,2,6,4,3,5],[4,3,5,1,2,6],[5,1,2,6,4,3],[6,4,3,5,1,2],[3,5,1,2,6,4],[2,6,4,3,5,1]] },
  { id: "normal-1", difficulty: "normal", puzzle: [[3,4,0,5,0,6],[0,1,5,0,4,3],[0,0,0,1,3,0],[0,3,0,0,6,2],[0,0,0,6,5,4],[4,0,0,3,2,1]], solution: [[3,4,2,5,1,6],[6,1,5,2,4,3],[2,6,4,1,3,5],[5,3,1,4,6,2],[1,2,3,6,5,4],[4,5,6,3,2,1]] },
  { id: "normal-2", difficulty: "normal", puzzle: [[2,5,0,1,0,0],[3,0,1,0,5,2],[0,0,4,5,0,1],[1,2,5,4,0,0],[0,6,0,0,0,0],[4,1,0,3,6,0]], solution: [[2,5,6,1,4,3],[3,4,1,6,5,2],[6,3,4,5,2,1],[1,2,5,4,3,6],[5,6,3,2,1,4],[4,1,2,3,6,5]] },
  { id: "normal-3", difficulty: "normal", puzzle: [[0,1,5,4,3,2],[0,0,0,0,0,1],[0,3,6,2,4,0],[0,0,4,1,6,3],[5,6,0,3,0,0],[3,0,1,5,2,6]], solution: [[6,1,5,4,3,2],[4,2,3,6,5,1],[1,3,6,2,4,5],[2,5,4,1,6,3],[5,6,2,3,1,4],[3,4,1,5,2,6]] },
  { id: "normal-4", difficulty: "normal", puzzle: [[1,4,6,0,0,3],[3,2,0,4,6,0],[2,6,0,5,3,4],[4,0,3,0,0,2],[6,3,0,0,0,0],[0,1,0,3,4,0]], solution: [[1,4,6,2,5,3],[3,2,5,4,6,1],[2,6,1,5,3,4],[4,5,3,6,1,2],[6,3,4,1,2,5],[5,1,2,3,4,6]] },
  { id: "normal-5", difficulty: "normal", puzzle: [[6,4,2,3,5,1],[0,0,1,4,6,0],[3,1,0,0,0,5],[4,2,5,1,0,0],[0,0,4,5,2,0],[0,0,3,0,0,0]], solution: [[6,4,2,3,5,1],[5,3,1,4,6,2],[3,1,6,2,4,5],[4,2,5,1,3,6],[1,6,4,5,2,3],[2,5,3,6,1,4]] },
  { id: "normal-6", difficulty: "normal", puzzle: [[1,6,0,5,0,0],[0,0,0,0,4,0],[5,4,0,0,1,6],[6,2,0,4,3,5],[4,1,0,0,0,2],[2,3,0,0,5,0]], solution: [[1,6,4,5,2,3],[3,5,2,6,4,1],[5,4,3,2,1,6],[6,2,1,4,3,5],[4,1,5,3,6,2],[2,3,6,1,5,4]] },
];

function cloneGrid(grid) {
  return grid.map((row) => [...row]);
}

function key(row, col) {
  return `${row},${col}`;
}

function groupIsValid(values) {
  return values.length === SIZE && new Set(values).size === SIZE && values.every((value) => value >= 1 && value <= SIZE);
}

export function createSudokuGame(index = 0) {
  const source = PUZZLES[index % PUZZLES.length];
  const puzzle = cloneGrid(source.puzzle);
  return {
    puzzle,
    solution: cloneGrid(source.solution),
    entries: cloneGrid(puzzle),
    givens: new Set(puzzle.flatMap((row, rowIndex) => row.map((value, colIndex) => (
      value === 0 ? null : key(rowIndex, colIndex)
    ))).filter(Boolean)),
  };
}

export function listSudokuPuzzles() {
  return PUZZLES.map((puzzle) => ({
    id: puzzle.id,
    difficulty: puzzle.difficulty,
    puzzle: cloneGrid(puzzle.puzzle),
    solution: cloneGrid(puzzle.solution),
  }));
}

export function isValidSolution(grid) {
  for (let row = 0; row < SIZE; row += 1) {
    if (!groupIsValid(grid[row])) return false;
  }

  for (let col = 0; col < SIZE; col += 1) {
    const values = grid.map((row) => row[col]);
    if (!groupIsValid(values)) return false;
  }

  for (let rowStart = 0; rowStart < SIZE; rowStart += BOX_ROWS) {
    for (let colStart = 0; colStart < SIZE; colStart += BOX_COLS) {
      const values = [];
      for (let row = rowStart; row < rowStart + BOX_ROWS; row += 1) {
        for (let col = colStart; col < colStart + BOX_COLS; col += 1) {
          values.push(grid[row][col]);
        }
      }
      if (!groupIsValid(values)) return false;
    }
  }

  return true;
}

export function findConflicts(grid, givens = new Set()) {
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

  for (let row = 0; row < SIZE; row += 1) {
    markDuplicates(grid[row].map((value, col) => ({ row, col, value })));
  }

  for (let col = 0; col < SIZE; col += 1) {
    markDuplicates(grid.map((rowValues, row) => ({ row, col, value: rowValues[col] })));
  }

  for (let rowStart = 0; rowStart < SIZE; rowStart += BOX_ROWS) {
    for (let colStart = 0; colStart < SIZE; colStart += BOX_COLS) {
      const cells = [];
      for (let row = rowStart; row < rowStart + BOX_ROWS; row += 1) {
        for (let col = colStart; col < colStart + BOX_COLS; col += 1) {
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

export function isSolved(grid, solution, givens = new Set()) {
  if (findConflicts(grid, givens).size > 0) return false;
  for (let row = 0; row < SIZE; row += 1) {
    for (let col = 0; col < SIZE; col += 1) {
      if (grid[row][col] !== solution[row][col]) return false;
    }
  }
  return true;
}

export function cellKey(row, col) {
  return key(row, col);
}
