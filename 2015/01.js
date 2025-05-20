const input = require("./01.input.json");

function part1() {
  let floor = 0;

  for (const char of input) {
    if (char === "(") {
      floor += 1;
    } else if (char === ")") {
      floor -= 1;
    }
  }

  return floor;
}

function part2() {
  let floor = 0;

  for (let i = 0; i < input.length; i++) {
    const char = input.charAt(i);

    if (char === "(") {
      floor += 1;
    } else if (char === ")") {
      floor -= 1;
    }

    if (floor === -1) {
      return i + 1;
    }
  }

  return -1;
}

console.log(part1());
console.log(part2());
