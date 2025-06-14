import { INPUT } from "./01.input.js";

const directions = {
  NORTH: "north",
  SOUTH: "south",
  EAST: "east",
  WEST: "west",
};

let position = { row: 0, column: 0 };
let facing = directions.NORTH;

const instructions = INPUT.split(", ");

let visited = new Set();
visited.add([position.row, position.column].toString());
let firstPositionVisitedTwice;

function registerMove(axis, amount, sign) {
  for (let i = 0; i < amount; i++) {
    position[axis] += sign;

    const key = [position.row, position.column].toString();

    if (visited.has(key) && !firstPositionVisitedTwice) {
      firstPositionVisitedTwice = Object.assign({}, position);
    }

    visited.add(key);
  }
}

for (let i = 0; i < instructions.length; i++) {
  let instruction = instructions[i];
  let direction = instruction.slice(0, 1);
  let amount = parseInt(instruction.slice(1), 10);

  switch (direction) {
    case "L": {
      if (facing === directions.NORTH) {
        registerMove("column", amount, -1);
        facing = directions.WEST;
        break;
      }

      if (facing === directions.WEST) {
        registerMove("row", amount, -1);
        facing = directions.SOUTH;
        break;
      }

      if (facing === directions.SOUTH) {
        registerMove("column", amount, +1);
        facing = directions.EAST;
        break;
      }

      if (facing === directions.EAST) {
        registerMove("row", amount, +1);
        facing = directions.NORTH;
        break;
      }
    }

    case "R": {
      if (facing === directions.NORTH) {
        registerMove("column", amount, +1);
        facing = directions.EAST;
        break;
      }

      if (facing === directions.WEST) {
        registerMove("row", amount, +1);
        facing = directions.NORTH;
        break;
      }

      if (facing === directions.SOUTH) {
        registerMove("column", amount, -1);
        facing = directions.WEST;
        break;
      }

      if (facing === directions.EAST) {
        registerMove("row", amount, -1);
        facing = directions.SOUTH;
        break;
      }
    }
    default: {
      throw new Error(`Wrong direction '${direction}'`);
    }
  }
}

const part1 = Math.abs(position.row) + Math.abs(position.column);
const part2 =
  Math.abs(firstPositionVisitedTwice.row) +
  Math.abs(firstPositionVisitedTwice.column);

console.log({ part1, part2 });
