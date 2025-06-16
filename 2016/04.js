import fs from "node:fs/promises";
import path from "node:path";

const input = await fs.readFile(
  path.join(import.meta.dirname, "./04.input.txt"),
  "utf8"
);

const lines = input.split("\n");

const roomRegex = /(?<name>.*)-(?<sectorId>\d+)\[(?<checksum>[a-z]+)\]/;

let sum = 0;

for (const line of lines) {
  const {
    groups: { name, sectorId, checksum },
  } = line.match(roomRegex);

  const map = new Map();

  for (const char of name) {
    if (char === "-") {
      continue;
    }

    if (map.has(char)) {
      map.set(char, map.get(char) + 1);
    } else {
      map.set(char, 1);
    }
  }

  const sorted = [...map].sort(([charA, countA], [charB, countB]) => {
    if (countA === countB) {
      return charA > charB ? 1 : -1;
    }

    return countB - countA;
  });

  const fiveMostCommonLetters = sorted
    .slice(0, 5)
    .map((x) => x[0])
    .join("");

  if (checksum === fiveMostCommonLetters) {
    sum += parseInt(sectorId, 10);
  }
}

console.log({ sum });
