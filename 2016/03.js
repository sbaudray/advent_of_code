import fs from "node:fs/promises";
import path from "node:path";

const input = await fs.readFile(
  path.join(import.meta.dirname, "./03.input.txt"),
  "utf8"
);

const lines = input.split("\n");

const TRIANGLES = lines.map((line) => {
  return line.match(/\d+/g).map((x) => parseInt(x, 10));
});

const TRIANGLES_BY_COLUMN = [];

for (let i = 0; i < TRIANGLES.length; i += 3) {
  TRIANGLES_BY_COLUMN.push([
    TRIANGLES[i][0],
    TRIANGLES[i + 1][0],
    TRIANGLES[i + 2][0],
  ]);
  TRIANGLES_BY_COLUMN.push([
    TRIANGLES[i][1],
    TRIANGLES[i + 1][1],
    TRIANGLES[i + 2][1],
  ]);
  TRIANGLES_BY_COLUMN.push([
    TRIANGLES[i][2],
    TRIANGLES[i + 1][2],
    TRIANGLES[i + 2][2],
  ]);
}

function possible(triangles) {
  let possible = 0;

  for (const triangle of triangles) {
    const sorted = triangle.sort((a, b) => a - b);

    if (sorted[0] + sorted[1] > sorted[2]) {
      possible += 1;
    }
  }

  return possible;
}

console.log({
  part1: possible(TRIANGLES),
  part2: possible(TRIANGLES_BY_COLUMN),
});
