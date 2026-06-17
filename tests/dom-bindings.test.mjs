import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const appSource = readFileSync(join(root, "src", "app.mjs"), "utf8");
const htmlSource = readFileSync(join(root, "index.html"), "utf8");

const ids = [...appSource.matchAll(/querySelector\("#([^"]+)"\)/g)].map((match) => match[1]);
const missing = ids.filter((id) => !htmlSource.includes(`id="${id}"`));

assert.deepEqual(missing, [], "Every app querySelector id should exist in index.html");
