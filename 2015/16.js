import fs from "node:fs/promises";
import path from "node:path";

const input = await fs.readFile(
  path.join(import.meta.dirname, "./16.input.txt"),
  "utf8"
);
const lines = input.split("\n");

function parseAuntSue(line) {
  const id = line.match(/\d+/)[0];
  const things = line.match(/\w+: \d+/g).map((stat) => {
    const [thing, quantity] = stat.split(": ");
    return [thing, parseInt(quantity, 10)];
  });

  return {
    id,
    things: new Map(things),
  };
}

const AUNTIES = lines.map(parseAuntSue);

const ANALYSIS = {
  children: 3,
  cats: 7,
  samoyeds: 2,
  pomeranians: 3,
  akitas: 0,
  vizslas: 0,
  goldfish: 5,
  trees: 3,
  cars: 2,
  perfumes: 1,
};

function findSue() {
  let sue;

  auntiesLoop: for (const { id, things } of AUNTIES) {
    for (const [thing, quantity] of things) {
      if (ANALYSIS[thing] !== quantity) {
        continue auntiesLoop;
      }
    }

    sue = id;
  }

  return sue ?? -1;
}

console.log({ part1: findSue() });
