import fs from "node:fs/promises";
import path from "node:path";

const input = await fs.readFile(
  path.join(import.meta.dirname, "./02.input.txt"),
  "utf8"
);

const INSTRUCTIONS = input.split("\n");

const KEYPAD = [
  [1, 2, 3],
  [4, 5, 6],
  [7, 8, 9],
];

let row = 1;
let column = 1;

let code = "";

for (let i = 0; i < INSTRUCTIONS.length; i++) {
  for (const char of INSTRUCTIONS[i]) {
    switch (char) {
      case "L": {
        column = column - 1 >= 0 ? column - 1 : column;
        break;
      }
      case "R": {
        column = column + 1 < KEYPAD[row].length ? column + 1 : column;
        break;
      }
      case "U": {
        row = row - 1 >= 0 ? row - 1 : row;
        break;
      }
      case "D": {
        row = row + 1 < KEYPAD.length ? row + 1 : row;
        break;
      }
    }
  }

  code += KEYPAD[row][column];
}

console.log({ code });
