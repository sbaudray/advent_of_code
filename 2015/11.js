import input from './11.input.json' with { type: 'json'};

const letters = "abcdefghijklmnopqrstuvwxyz";

function successor(input) {
  const arr = input.split("");

  let loop = true;

  while (loop) {
    for (let i = input.length - 1; i > -1; i -= 1) {
      const charIndex = letters.indexOf(arr[i]);
      const nextIndex = charIndex + 1;
      const wrappedAround = nextIndex === letters.length;
      const nextCharIndex = wrappedAround ? 0 : nextIndex;

      arr[i] = letters[nextCharIndex];

      if (!wrappedAround) {
        loop = false;
        break;
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

function noForbiddenLetters() {
  return !/i|o|l/.test(input);
}

function twoDifferentPairs(input) {
  return /(.)\1.*(?:(?!\1)(.))\2/.test(input);
}

export function isValidPassword(password) {
  return (
    noForbiddenLetters(password) &&
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

console.log({ part1: part1(input) });