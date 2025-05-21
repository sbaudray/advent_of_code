import fs from "node:fs/promises";
import path from "node:path";
import { escape } from "node:querystring";

const input = await fs.readFile(
  path.join(import.meta.dirname, "./08.input.txt"),
  "utf8"
);

const lines = input.split("\n");

export function deltaBetweenCodeCharactersAndValueCharacters(line) {
  const escaped = line
    .replace(/\\x([0-9a-fA-F]{2})/g, (_match, hex) => {
      return String.fromCodePoint(parseInt(hex, 16));
    })
    .replace(/\\"/g, '"')
    .replace(/\\\\/g, "\\")
    .slice(1, -1);

  return line.length - escaped.length;
}

function part1(lines) {
  let delta = 0;

  for (const line of lines) {
    delta += deltaBetweenCodeCharactersAndValueCharacters(line);
  }

  return delta;
}

console.log(part1(lines));
