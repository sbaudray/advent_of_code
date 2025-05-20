import readline from "readline";
import fs from "node:fs";
import { fileURLToPath, pathToFileURL } from "node:url";
import path, { dirname } from "node:path";
import { pipeline } from "node:stream/promises";
import { Transform, Writable } from "node:stream";

const filename = fileURLToPath(import.meta.url);
const __dirname = dirname(filename);

function InstructionsStream() {
  return readline.createInterface({
    input: fs.createReadStream(path.join(__dirname, "./06.input.txt")),
  });
}

function lightGrid() {
  let grid = [];

  for (let i = 0; i < 1000; i++) {
    grid[i] = [];

    for (let j = 0; j < 1000; j++) {
      grid[i][j] = 0;
    }
  }

  return grid;
}

const instructionRegex =
  /(?<command>toggle|turn off|turn on)\s(?<startX>\d{0,3}),(?<startY>\d{0,3}) through (?<endX>\d{0,3}),(?<endY>\d{0,3})/;

function parseInstruction(instructionString) {
  const { groups } = instructionString.match(instructionRegex);

  return {
    command: groups.command,
    startX: parseInt(groups.startX, 10),
    endX: parseInt(groups.endX, 10),
    startY: parseInt(groups.startY, 10),
    endY: parseInt(groups.endY, 10),
  };
}

function countLightIntensity(grid) {
  let count = 0;
  grid.forEach((row) => {
    row.forEach((light) => {
      count += light;
    });
  });
  return count;
}

function InstructionParserStream() {
  return new Transform({
    objectMode: true,
    transform(instructionString, _, done) {
      done(null, parseInstruction(instructionString));
    },
  });
}

function InstructionRunnerStream(run) {
  return new Writable({
    objectMode: true,
    write(instruction, _, done) {
      run(instruction);

      done();
    },
  });
}

async function part1() {
  let grid = lightGrid();

  function run(instruction) {
    const { startX, startY, endX, endY, command } = instruction;

    for (let i = startX; i <= endX; i += 1) {
      for (let j = startY; j <= endY; j += 1) {
        switch (command) {
          case "turn on":
            grid[i][j] = 1;
            break;
          case "turn off":
            grid[i][j] = 0;
            break;
          case "toggle":
            // toggle with bitwise XOR
            grid[i][j] = grid[i][j] ^ 1;
            break;
          default:
            throw new Error(JSON.stringify(instruction));
        }
      }
    }
  }

  await pipeline(
    InstructionsStream(),
    InstructionParserStream(),
    InstructionRunnerStream(run)
  );

  console.log({ part1: countLightIntensity(grid) });
}

async function part2() {
  let grid = lightGrid();

  function run(instruction) {
    const { startX, startY, endX, endY, command } = instruction;

    for (let i = startX; i <= endX; i += 1) {
      for (let j = startY; j <= endY; j += 1) {
        switch (command) {
          case "turn on":
            grid[i][j] = grid[i][j] + 1;
            break;
          case "turn off":
            grid[i][j] = Math.max(0, grid[i][j] - 1);
            break;
          case "toggle":
            grid[i][j] = grid[i][j] + 2;
            break;
          default:
            throw new Error(JSON.stringify(instruction));
        }
      }
    }
  }

  await pipeline(
    InstructionsStream(),
    InstructionParserStream(),
    InstructionRunnerStream(run)
  );

  console.log({ part2: countLightIntensity(grid) });
}

part1().catch(console.error);
part2().catch(console.error);
