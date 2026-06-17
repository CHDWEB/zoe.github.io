import assert from "node:assert/strict";
import {
  createSudokuGame,
  isValidSolution,
  listSudokuPuzzles,
  solveSudoku,
} from "../src/sudoku.mjs";

function cloneGrid(grid) {
  return grid.map((row) => [...row]);
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

function countSolutions(puzzle, settings, limit = 2) {
  const grid = cloneGrid(puzzle);
  let solutions = 0;

  function solve() {
    if (solutions >= limit) return;
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
      solutions += 1;
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

function assertPuzzleSet(size, expectedCount) {
  const puzzles = listSudokuPuzzles(size);
  const settings = {
    size,
    boxRows: size === 6 ? 2 : 3,
    boxCols: 3,
  };
  const segment = expectedCount / 3;

  assert.equal(puzzles.length, expectedCount, `${size}x${size} puzzle count`);
  assert.deepEqual(
    puzzles.map((puzzle) => puzzle.level),
    Array.from({ length: expectedCount }, (_, index) => index + 1),
    `${size}x${size} levels should be sequential`,
  );

  for (const puzzle of puzzles) {
    const expectedDifficulty = puzzle.level <= segment
      ? "simple"
      : puzzle.level <= segment * 2
        ? "normal"
        : "challenge";

    assert.equal(puzzle.difficulty, expectedDifficulty, `level ${puzzle.level} difficulty`);
    assert.equal(puzzle.puzzle.length, size, `level ${puzzle.level} row count`);
    assert.equal(puzzle.solution.length, size, `level ${puzzle.level} solution row count`);
    assert.ok(isValidSolution(puzzle.solution, { size }), `level ${puzzle.level} valid solution`);
    assert.deepEqual(
      solveSudoku(puzzle.puzzle, { size }),
      puzzle.solution,
      `level ${puzzle.level} solver result`,
    );
    assert.equal(countSolutions(puzzle.puzzle, settings), 1, `level ${puzzle.level} unique solution`);
  }
}

assertPuzzleSet(6, 36);
assertPuzzleSet(9, 81);

const firstSix = createSudokuGame({ size: 6, level: 1 });
const firstSixAgain = createSudokuGame({ size: 6, level: 1 });
assert.equal(firstSix.level, 1);
assert.equal(firstSix.difficulty, "simple");
assert.deepEqual(firstSix.puzzle, firstSixAgain.puzzle);
assert.deepEqual(firstSix.solution, firstSixAgain.solution);

const finalNine = createSudokuGame({ size: 9, level: 81 });
assert.equal(finalNine.level, 81);
assert.equal(finalNine.difficulty, "challenge");
