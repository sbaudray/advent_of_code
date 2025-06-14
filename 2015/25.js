import { INPUT } from "./25.input.js";

function fillPaper() {
  let gridSize = Math.max(INPUT.column, INPUT.row) * 2;

  const grid = Array(gridSize)
    .fill(null)
    .map((x) => []);

  let row = 0;
  let column = 0;
  let diagonal = 0;

  let val = 20151125;

  while (true) {
    grid[row][column] = val;

    // INPUT is for a grid with a starting index of 1
    if (row === INPUT.row - 1 && column === INPUT.column - 1) {
      return val;
    }

    val = (val * 252533) % 33554393;

    if (column === diagonal) {
      diagonal++;
      row = diagonal;
      column = 0;
    } else {
      row--;
      column++;
    }
  }
}

console.log(fillPaper());
