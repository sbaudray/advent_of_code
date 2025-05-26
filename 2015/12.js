import input from './12.input.json' with { type: 'json'}

function traverseWithSum(structure, options = {}) {
  if (Array.isArray(structure)) {
    let sum = 0;
    for (const struct of structure) {
      sum += traverseWithSum(struct, options);
    }

    return sum;
  }

  if (typeof structure === "string") {
    return 0;
  }

  if (typeof structure === "number") {
    return structure;
  }

  if (typeof structure === "object") {
    const values = Object.values(structure);

    if (options.ignoreObjectsWithRed && values.includes("red")) {
      return 0;
    }

    return traverseWithSum(Object.values(structure), options);
  }
}

function part1(input) {
  return traverseWithSum(input);
}

function part2(input) {
  return traverseWithSum(input, { ignoreObjectsWithRed: true });
}

console.log({ part1: part1(input), part2: part2(input) });
