import fs from "node:fs/promises";
import path from "node:path";

const input = await fs.readFile(
  path.join(import.meta.dirname, "./18.input.txt"),
  "utf8"
);

const lines = input.split("\n");

function buildLightGrid() {
  let grid = {};

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    for (let j = 0; j < line.length; j++) {
      let char = line[j];

      grid[[i, j]] = char === "#" ? 1 : 0;
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
  let neighboursOn = 0;

  for (const [deltaX, deltaY] of neighboursDeltaList) {
    const neighbour = grid[[row + deltaX, column + deltaY]];

    neighboursOn += neighbour ?? 0;
  }

  return neighboursOn;
}

function animateGrid(grid) {
  let newGrid = {};

  for (const [key, light] of Object.entries(grid)) {
    const [row, column] = key.split(",");

    const neighboursOn = countNeighboursOn(
      parseInt(row, 10),
      parseInt(column, 10),
      grid
    );

    if (light === 1) {
      newGrid[[row, column]] = neighboursOn === 2 || neighboursOn === 3 ? 1 : 0;
    } else if (light === 0) {
      newGrid[[row, column]] = neighboursOn === 3 ? 1 : 0;
    }
  }

  return newGrid;
}

function runLightGrid(times) {
  let grid = buildLightGrid();

  for (let i = 0; i < times; i++) {
    grid = animateGrid(grid);
  }

  return grid;
}

function countLightsOn(grid) {
  let count = 0;
  for (const light of Object.values(grid)) {
    count += light;
  }
  return count;
}

console.log({ part1: countLightsOn(runLightGrid(100)) });
