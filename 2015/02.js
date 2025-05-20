const readline = require("node:readline");
const { pipeline } = require("node:stream/promises");
const fs = require("node:fs");
const { Writable } = require("node:stream");
const path = require("node:path");

function GiftBoxesDimensionsStream() {
  return readline.createInterface({
    input: fs.createReadStream(path.join(__dirname, "./02.input.txt")),
  });
}

async function part1() {
  function WrappingPaperComputerStream() {
    let paperNeededInSquareFeet = 0;

    return new Writable({
      objectMode: true,
      write(giftBoxDimensions, _, done) {
        const [length, width, height] = giftBoxDimensions.split("x");

        const boxSurfaceArea =
          2 * (length * width + length * height + width * height);

        const boxSmallestSideArea = Math.min(
          length * width,
          length * height,
          width * height
        );

        paperNeededInSquareFeet += boxSurfaceArea + boxSmallestSideArea;

        done();
      },
      final(done) {
        console.log({ paperNeededInSquareFeet });
        done();
      },
    });
  }

  await pipeline(GiftBoxesDimensionsStream(), WrappingPaperComputerStream());
}

async function part2() {
  function RibbonComputerStream() {
    let ribbonNeededInFeet = 0;

    return new Writable({
      objectMode: true,
      write(giftBoxDimensions, _, done) {
        const edges = giftBoxDimensions.split("x");
        const [length, width, height] = edges;

        const smallestEdges = edges.sort((a, b) => a - b).slice(0, 2);

        const smallestPerimeter = 2 * smallestEdges[0] + 2 * smallestEdges[1];

        const volume = length * width * height;

        ribbonNeededInFeet += smallestPerimeter + volume;
        done();
      },
      final(done) {
        console.log({ ribbonNeededInFeet });
        done();
      },
    });
  }

  await pipeline(GiftBoxesDimensionsStream(), RibbonComputerStream());
}

part1().catch(console.error);
part2().catch(console.error);
