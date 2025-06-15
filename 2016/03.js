import fs from "node:fs/promises";
import path from "node:path";

const input = await fs.readFile(
  path.join(import.meta.dirname, "./03.input.txt"),
  "utf8"
);

const TRIANGLES = input.split("\n").map((line) => {
  return line.match(/\d+/g).map((x) => parseInt(x, 10));
});

let possible = 0;

for (const triangle of TRIANGLES) {
  const sorted = triangle.sort((a, b) => a - b);

  if (sorted[0] + sorted[1] > sorted[2]) {
    possible += 1;
  }
}

console.log({ possible });
