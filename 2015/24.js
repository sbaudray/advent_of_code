import fs from "node:fs/promises";
import path from "node:path";

const input = await fs.readFile(
  path.join(import.meta.dirname, "./24.input.txt"),
  "utf8"
);

const lines = input.split("\n");

const WEIGHTS = lines.map((line) => parseInt(line, 10)).sort((a, b) => b - a);

function* combinations(targetSize, list, start = 0, current = []) {
  if (current.length === targetSize) {
    yield current;
    return;
  }

  for (let i = start; i < list.length; i++) {
    yield* combinations(targetSize, list, i + 1, [...current, list[i]]);
  }
}

function canPartition(targetWeight, weights, numOfGroups) {
  if (numOfGroups === 0) {
    return true;
  }

  if (weights.length === 0) {
    return false;
  }

  function buildGroup(index, currentGroup, currentSum) {
    if (currentSum === targetWeight) {
      return currentGroup;
    }

    if (currentSum > targetWeight || index > weights.length) {
      return;
    }

    for (let i = 0; i < weights.length; i++) {
      const currentWeight = weights[i];
      currentGroup.push(currentWeight);

      const result = buildGroup(
        index + 1,
        currentGroup,
        currentSum + currentWeight
      );

      if (result) {
        return result;
      }

      currentGroup.pop();
    }
  }

  const group = buildGroup(0, [], 0);

  if (!group) {
    return false;
  }

  const remainingWeights = weights.filter((weight) => !group.includes(weight));

  return canPartition(targetWeight, remainingWeights, numOfGroups - 1);
}

function findSmallestQuantumEntanglement({ numOfGroups }) {
  const totalWeight = WEIGHTS.reduce((sum, value) => sum + value);
  const targetWeight = totalWeight / numOfGroups;

  let smallestQuantumEntanglement = Infinity;

  for (let size = 1; size < WEIGHTS.length - numOfGroups + 1; size++) {
    let foundValidGroup = false;

    for (const group of combinations(size, WEIGHTS)) {
      const weight = group.reduce((sum, value) => sum + value);

      if (weight !== targetWeight) {
        continue;
      }

      const remainingWeights = WEIGHTS.filter(
        (weight) => !group.includes(weight)
      );

      if (canPartition(targetWeight, remainingWeights, numOfGroups - 1)) {
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

console.log({
  part1: findSmallestQuantumEntanglement({ numOfGroups: 3 }),
  part2: findSmallestQuantumEntanglement({ numOfGroups: 4 }),
});
