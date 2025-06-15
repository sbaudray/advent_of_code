import fs from "node:fs/promises";
import path from "node:path";

const input = await fs.readFile(
  path.join(import.meta.dirname, "./02.input.txt"),
  "utf8"
);

const INSTRUCTIONS = input.split("\n");

function findCode(keypad) {
  let row;
  let column;

  for (let i = 0; i < keypad.length; i++) {
    for (let j = 0; j < keypad[i].length; j++) {
      if (keypad[i][j] === 5) {
        row = i;
        column = j;
      }
    }
  }

  let code = "";

  for (let i = 0; i < INSTRUCTIONS.length; i++) {
    for (const char of INSTRUCTIONS[i]) {
      switch (char) {
        case "L": {
          if (keypad[row]?.[column - 1]) {
            column -= 1;
          }
          break;
        }
        case "R": {
          if (keypad[row]?.[column + 1]) {
            column = column += 1;
          }
          break;
        }
        case "U": {
          if (keypad[row - 1]?.[column]) {
            row -= 1;
          }
          break;
        }
        case "D": {
          if (keypad[row + 1]?.[column]) {
            row += 1;
          }
          break;
        }
      }
    }

    code += keypad[row][column];
  }

  return code;
}

console.log({
  part1: findCode([
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9],
  ]),
  part2: findCode([
    [, , 1, ,],
    [, 2, 3, 4],
    [5, 6, 7, 8, 9],
    [, "A", "B", "C"],
    [, , "D", ,],
  ]),
});
