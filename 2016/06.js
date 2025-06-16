import fs from "node:fs/promises";
import path from "node:path";

const input = await fs.readFile(
  path.join(import.meta.dirname, "./06.input.txt"),
  "utf8"
);

const lines = input.split("\n");

const charFrequencyMaps = Array.from({ length: 8 }, () => new Map());
const maxes = Array.from({ length: 8 }, () => ({ count: 0, char: null }));

for (const line of lines) {
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    const map = charFrequencyMaps[i];

    const newCount = map.has(char) ? map.get(char) + 1 : 1;

    map.set(char, newCount);

    const max = maxes[i];

    if (newCount > max.count) {
      max.char = char;
      max.count = newCount;
    }
  }
}

const corrected1 = maxes.map((x) => x.char).join("");

let corrected2 = "";

for (const map of charFrequencyMaps) {
  let minCount = Infinity;
  let minChar;

  for (const [char, count] of map) {
    if (count < minCount) {
      minCount = count;
      minChar = char;
    }
  }

  corrected2 += minChar;
}

console.log({ corrected1, corrected2 });
