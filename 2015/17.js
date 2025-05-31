import fs from "node:fs/promises";
import path from "node:path";

const input = await fs.readFile(
  path.join(import.meta.dirname, "./17.input.txt"),
  "utf8"
);

const lines = input.split("\n");

const CONTAINERS = lines.map((line) => parseInt(line, 10));

const EXPECTED_LITERS = 150;

class Combination {
  containers = [];
  liters = 0;

  add(container) {
    this.containers.push(container);
    this.liters += container;
  }

  removeLast() {
    const last = this.containers.pop();
    this.liters -= last;
  }
}

function combinations({
  currentCombination = new Combination(),
  allCombinations = [],
  currentIndex = 0,
} = {}) {
  if (currentCombination.liters > EXPECTED_LITERS) {
    return;
  }

  if (currentCombination.liters === EXPECTED_LITERS) {
    allCombinations.push(currentCombination.containers.slice());
    return;
  }

  for (let i = currentIndex; i < CONTAINERS.length; i++) {
    const container = CONTAINERS[i];

    currentCombination.add(container);

    combinations({
      currentCombination,
      currentIndex: i + 1,
      allCombinations,
    });

    currentCombination.removeLast();
  }

  return allCombinations;
}

console.log({ part1: combinations().length });
