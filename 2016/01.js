import { INPUT } from "./01.input.js";

const directions = {
  NORTH: "north",
  SOUTH: "south",
  EAST: "east",
  WEST: "west",
};

let row = 0;
let column = 0;
let facing = directions.NORTH;

const instructions = INPUT.split(" ").map((str) => str.trim().replace(",", ""));

for (let i = 0; i < instructions.length; i++) {
  let instruction = instructions[i];
  let direction = instruction.slice(0, 1);
  let amount = parseInt(instruction.slice(1), 10);

  switch (direction) {
    case "L": {
      if (facing === directions.NORTH) {
        column -= amount;
        facing = directions.WEST;
        break;
      }

      if (facing === directions.WEST) {
        row -= amount;
        facing = directions.SOUTH;
        break;
      }

      if (facing === directions.SOUTH) {
        column += amount;
        facing = directions.EAST;
        break;
      }

      if (facing === directions.EAST) {
        row += amount;
        facing = directions.NORTH;
        break;
      }
    }

    case "R": {
      if (facing === directions.NORTH) {
        column += amount;
        facing = directions.EAST;
        break;
      }

      if (facing === directions.WEST) {
        row += amount;
        facing = directions.NORTH;
        break;
      }

      if (facing === directions.SOUTH) {
        column -= amount;
        facing = directions.WEST;
        break;
      }

      if (facing === directions.EAST) {
        row -= amount;
        facing = directions.SOUTH;
        break;
      }
    }
    default: {
      throw new Error(`Wrong direction '${direction}'`);
    }
  }
}

const result = Math.abs(column) + Math.abs(row);

console.log({ part1: result });
