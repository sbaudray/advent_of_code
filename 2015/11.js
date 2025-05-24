import input from "./11.input.json" with { type: "json" };

const letters = "abcdefghijklmnopqrstuvwxyz";

function successor(input) {
  const arr = input.split("");

  mainLoop: while (true) {
    for (let i = input.length - 1; i >= 0; i -= 1) {
      const nextIndex = letters.indexOf(arr[i]) + 1;
      const nextLetter = letters[nextIndex % letters.length]

      arr[i] = nextLetter;

      if (nextLetter !== 'a') {
        break mainLoop;
      }
    }
  }

  return arr.join("");
}

function threeStraightLetters(input) {
  return /abc|bcd|cde|def|efg|fgh|ghi|hij|ijk|jkl|klm|lmn|mno|nop|opq|pqr|qrs|rst|stu|tuv|uvw|vwx|wxy|xyz/.test(
    input
  );
}

function forbiddenLetters() {
  return /i|o|l/.test(input);
}

function twoDifferentPairs(input) {
  return /(.)\1.*(?:(?!\1)(.))\2/.test(input);
}

export function isValidPassword(password) {
  return (
    !forbiddenLetters(password) &&
    threeStraightLetters(password) &&
    twoDifferentPairs(password)
  );
}

function part1(input) {
  let result = input;

  do {
    result = successor(result);
  } while (!isValidPassword(result));

  return result;
}

const part1Result = part1(input);
const part2Result = part1(part1Result);

console.log({ part1: part1Result, part2: part2Result });
