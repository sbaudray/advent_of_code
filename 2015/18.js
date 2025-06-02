import fs from "node:fs/promises";
import path from "node:path";

const INPUT = await fs.readFile(
  path.join(import.meta.dirname, "./18.input.txt"),
  "utf8"
);

const LINES = INPUT.split("\n");

function buildLightGrid() {
  let grid = [];

  for (let i = 0; i < LINES.length; i++) {
    grid[i] = [];

    for (let j = 0; j < LINES.length; j++) {
      grid[i][j] = LINES[i][j] === "#" ? 1 : 0;
    }
  }

  return grid;
}

const neighboursDeltaList = [
  [-1, -1],
  [-1, 0],
  [-1, 1],
  [0, -1],
  [0, 1],
  [1, -1],
  [1, 0],
  [1, 1],
];

function countNeighboursOn(row, column, grid) {
  let count = 0;

  for (const [deltaX, deltaY] of neighboursDeltaList) {
    const x = row + deltaX;
    const y = column + deltaY;

    if (x >= 0 && x < grid.length && y >= 0 && y < grid.length) {
      count += grid[x][y];
    }
  }

  return count;
}

function animateGrid(grid, cornersAlwaysOn) {
  let newGrid = Array(grid.length);

  for (let x = 0; x < grid.length; x++) {
    newGrid[x] = [];

    for (let y = 0; y < grid.length; y++) {
      if (
        cornersAlwaysOn &&
        (x === 0 || x === grid.length - 1) &&
        (y === 0 || y === grid.length - 1)
      ) {
        newGrid[x][y] = 1;
        continue;
      }

      const neighboursOn = countNeighboursOn(x, y, grid);
      const light = grid[x][y];

      if (light === 1) {
        newGrid[x][y] = neighboursOn === 2 || neighboursOn === 3 ? 1 : 0;
      } else if (light === 0) {
        newGrid[x][y] = neighboursOn === 3 ? 1 : 0;
      }
    }
  }

  return newGrid;
}

function runLightGrid(times, cornersAlwaysOn) {
  let grid = buildLightGrid();

  for (let i = 0; i < times; i++) {
    grid = animateGrid(grid, cornersAlwaysOn);
  }

  return grid;
}

function countLightsOn(grid) {
  let count = 0;

  for (const row of grid) {
    for (const light of row) {
      count += light;
    }
  }

  return count;
}

console.log({
  part1: countLightsOn(runLightGrid(100)),
  part2: countLightsOn(runLightGrid(100, true)),
});
