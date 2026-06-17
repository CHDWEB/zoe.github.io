import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const appSource = readFileSync(join(root, "src", "app.mjs"), "utf8");

const solvedBranch = appSource.match(
  /if \(isSolved\([\s\S]*?\)\) \{([\s\S]*?)\} else if \(conflicts\.size > 0\)/,
);

assert.ok(solvedBranch, "Sudoku completion branch should exist");
assert.match(
  solvedBranch[1],
  /stopSudokuClock\(\);/,
  "Sudoku completion should stop the running timer",
);
