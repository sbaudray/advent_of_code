const fs = require("node:fs");
const path = require("node:path");
const { pipeline } = require("node:stream/promises");
const { Writable } = require("node:stream");

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
