const input = require("./10.input.json");

function lookAndSay(input, n = 1) {
  let previousNumber = input[0];
  let previousNumberCount = 0;
  let result = "";

  for (let i = 0; i < input.length; i += 1) {
    const char = input[i];

    if (char !== previousNumber) {
      result += `${previousNumberCount}${previousNumber}`;
      previousNumberCount = 0;
    }

    previousNumber = char;
    previousNumberCount += 1;

    if (i === input.length - 1) {
      result += `${previousNumberCount}${previousNumber}`;
      previousNumberCount = 0;
    }
  }

  if (n - 1 === 0) {
    return result;
  }

  return lookAndSay(result, n - 1);
}

function part1() {
  return lookAndSay(input, 40).length;
}

function part2() {
  return lookAndSay(input, 50).length;
}

console.log({ part1: part1() });
console.log({ part2: part2() });
