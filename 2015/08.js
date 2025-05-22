import fs from "node:fs/promises";
import path from "node:path";

const input = await fs.readFile(
  path.join(import.meta.dirname, "./08.input.txt"),
  "utf8"
);

const lines = input.split("\n");

function stringify(str) {
  return '"' + str.replace(/\\/g, "\\\\").replace(/"/g, '\\"') + '"';
}

function parse(str) {
  return str
    .replace(/\\"/g, '"')
    .replace(/\\\\/g, "\\")
    .replace(/\\x([0-9a-fA-F]{2})/g, (_match, hex) => {
      return String.fromCodePoint(parseInt(hex, 16));
    })
    .slice(1, -1);
}

function deltaBetweenRawStringAndParsedString(line) {
  return line.length - parse(line).length;
}

function deltaBetweenStringifiedStringAndRawString(line) {
  return stringify(line).length - line.length;
}

function part1(lines) {
  let delta = 0;

  for (const line of lines) {
    delta += deltaBetweenRawStringAndParsedString(line);
  }

  return delta;
}

function part2(lines) {
  let delta = 0;

  for (const line of lines) {
    delta += deltaBetweenStringifiedStringAndRawString(line);
  }

  return delta;
}

console.log({ part1: part1(lines) });
console.log({ part2: part2(lines) });
