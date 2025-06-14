import fs from "node:fs/promises";
import path from "node:path";

const input = await fs.readFile(
  path.join(import.meta.dirname, "./24.input.txt"),
  "utf8"
);

const lines = input.split("\n");

const PACKS = lines.map((line) => parseInt(line, 10)).sort((a, b) => b - a);

function* combinations(targetSize, list, start = 0, current = []) {
  if (current.length === targetSize) {
    yield current;
    return;
  }

  for (let i = start; i < list.length; i++) {
    yield* combinations(targetSize, list, i + 1, [...current, list[i]]);
  }
}

function canPartition(targetWeight, remaining) {
  for (let size = 1; size < remaining.length - 1; size++) {
    for (const group of combinations(size, remaining)) {
      const weight = group.reduce((sum, value) => sum + value);

      if (weight === targetWeight) {
        return true;
      }
    }
  }

  return false;
}

function smallest() {
  const total = PACKS.reduce((sum, value) => sum + value);
  const targetWeight = total / 3;

  let smallestQuantumEntanglement = Infinity;

  for (let size = 1; size < PACKS.length; size++) {
    let foundValidGroup = false;

    for (const group of combinations(size, PACKS)) {
      const weight = group.reduce((sum, value) => sum + value);

      if (weight !== targetWeight) {
        continue;
      }

      const remaining = PACKS.filter((pack) => !group.includes(pack));

      if (canPartition(targetWeight, remaining)) {
        foundValidGroup = true;

        const quantumEntanglement = group.reduce(
          (product, value) => product * value
        );

        if (quantumEntanglement < smallestQuantumEntanglement) {
          smallestQuantumEntanglement = quantumEntanglement;
        }
      }
    }

    if (foundValidGroup) {
      break;
    }
  }

  return smallestQuantumEntanglement;
}

console.log({ part1: smallest() });
