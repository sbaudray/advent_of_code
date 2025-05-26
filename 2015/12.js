import input from './12.input.json' with { type: 'json'}

function traverseWithCount(structure, sum = 0) {
  if (typeof structure === "string") {
    return 0;
  }

  if (typeof structure === "number" && structure !== NaN) {
    return structure;
  }

  if (Array.isArray(structure)) {
    for (const struct of structure) {
      sum += traverseWithCount(struct);
    }
  } else if (typeof structure === "object" && structure !== null) {
    sum += traverseWithCount(Object.values(structure));
  }

  return sum;
}

function part1(input) {
  return traverseWithCount(input);
}

console.log({ part1: part1(input) });
