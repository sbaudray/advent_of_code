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

    if (!map.has(char)) {
      map.set(char, 1);
      continue;
    }

    const newCount = map.get(char) + 1;

    map.set(char, newCount);

    const max = maxes[i];

    if (newCount > max.count) {
      max.char = char;
      max.count = newCount;
    }
  }
}

const corrected = maxes.map((x) => x.char).join("");

console.log({ corrected });
