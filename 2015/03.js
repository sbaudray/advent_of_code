const fs = require("node:fs");
const path = require("node:path");
const { pipeline } = require("node:stream/promises");
const { Writable } = require("node:stream");

// Santa is delivering presents to an infinite two-dimensional grid of houses.

// He begins by delivering a present to the house at his starting location,
// and then an elf at the North Pole calls him via radio and tells him where to move next.
// Moves are always exactly one house to the north (^), south (v), east (>), or west (<).
// After each move, he delivers another present to the house at his new location.

// However, the elf back at the north pole has had a little too much eggnog,
// and so his directions are a little off, and Santa ends up visiting some houses more than once.
// How many houses receive at least one present?

// For example:

// > delivers presents to 2 houses: one at the starting location, and one to the east.
// ^>v< delivers presents to 4 houses in a square, including twice to the house at
// his starting/ending location.
// ^v^v^v^v^v delivers a bunch of presents to some very lucky children at only 2 houses.

function DirectionsStream() {
  return fs.createReadStream(path.join(__dirname, "./03.input.txt"), {
    highWaterMark: 1,
    encoding: "utf8",
  });
}

const serializePosition = ({ x, y }) => `${x}:${y}`;

function move(direction, position) {
  switch (direction) {
    case "v":
      position.y -= 1;
      break;
    case "^":
      position.y += 1;
      break;
    case "<":
      position.x -= 1;
      break;
    case ">":
      position.x += 1;
      break;
  }
}

async function part1() {
  function HousesVisitedComputerStream() {
    let santaPosition = { x: 0, y: 0 };

    const housesVisited = new Set();

    housesVisited.add(serializePosition(santaPosition));

    return new Writable({
      objectMode: true,
      write(direction, _, done) {
        move(direction, santaPosition);
        housesVisited.add(serializePosition(santaPosition));
        done();
      },
      final(done) {
        console.log({ housesVisitedBySanta: housesVisited.size });
        done();
      },
    });
  }

  await pipeline(DirectionsStream(), HousesVisitedComputerStream());
}

// The next year, to speed up the process, Santa creates a robot version of himself,
// Robo-Santa, to deliver presents with him.

// Santa and Robo-Santa start at the same location (delivering two presents to the same starting house),
// then take turns moving based on instructions from the elf, who is eggnoggedly reading from
// the same script as the previous year.

// This year, how many houses receive at least one present?

// For example:

// v^ delivers presents to 3 houses, because Santa goes north, and then Robo-Santa goes south.
// ^>v< now delivers presents to 3 houses, and Santa and Robo-Santa end up back where they started.
// ^v^v^v^v^v now delivers presents to 11 houses, with Santa going one direction and
// Robo-Santa going the other.

async function part2() {
  function HousesVisitedComputerStream() {
    let turn = 0;

    let santaPosition = { x: 0, y: 0 };
    let santaRobotPosition = { x: 0, y: 0 };

    let housesVisited = new Set();

    housesVisited.add(serializePosition(santaPosition));

    return new Writable({
      objectMode: true,
      write(direction, _, done) {
        if (turn === 0) {
          move(direction, santaPosition);
          housesVisited.add(serializePosition(santaPosition));
          turn = 1;
        } else if (turn === 1) {
          move(direction, santaRobotPosition);
          housesVisited.add(serializePosition(santaRobotPosition));
          turn = 0;
        }

        done();
      },
      final(done) {
        console.log({ housesVisitedBySantaAndHisRobot: housesVisited.size });
        done();
      },
    });
  }

  await pipeline(DirectionsStream(), HousesVisitedComputerStream());
}

part1().catch(console.error);
part2().catch(console.error);
