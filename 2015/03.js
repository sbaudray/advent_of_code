const readline = require("node:readline");
const fs = require("node:fs");
const path = require("node:path");
const { pipeline } = require("node:stream/promises");
const { Writable, Transform } = require("node:stream");

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

async function part1() {
  const DirectionsStream = fs.createReadStream(
    path.join(__dirname, "./03.input.txt"),
    { highWaterMark: 1 }
  );

  function ToStringTransformerStream() {
    return new Transform({
      objectMode: true,
      transform(buffer, _, done) {
        done(null, buffer.toString());
      },
    });
  }

  function HousesVisitedComputerStream() {
    let santaPosition = { x: 0, y: 0 };

    const formatPosition = ({ x, y }) => `${x}:${y}`;

    const housesVisitedBySanta = new Set();

    housesVisitedBySanta.add(formatPosition(santaPosition));

    return new Writable({
      objectMode: true,
      write(direction, _, done) {
        switch (direction) {
          case "v":
            santaPosition.y -= 1;
            break;
          case "^":
            santaPosition.y += 1;
            break;
          case "<":
            santaPosition.x -= 1;
            break;
          case ">":
            santaPosition.x += 1;
            break;
        }

        housesVisitedBySanta.add(formatPosition(santaPosition));
        done();
      },
      final(done) {
        console.log({ housesVisitedBySanta: housesVisitedBySanta.size });
        done();
      },
    });
  }

  await pipeline(
    DirectionsStream,
    ToStringTransformerStream(),
    HousesVisitedComputerStream()
  );
}

part1().catch(console.error);
