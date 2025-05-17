const input = require("./04.input.json");
const crypto = require("node:crypto");

// Santa needs help mining some AdventCoins (very similar to bitcoins) to use as gifts for all
// the economically forward-thinking little girls and boys.

// To do this, he needs to find MD5 hashes which, in hexadecimal, start with at least five zeroes.
// The input to the MD5 hash is some secret key (your puzzle input, given below) followed by
// a number in decimal. To mine AdventCoins, you must find Santa the lowest positive number
// (no leading zeroes: 1, 2, 3, ...) that produces such a hash.

// For example:

// If your secret key is abcdef, the answer is 609043, because the MD5 hash of abcdef609043 starts with
// five zeroes (000001dbbfa...), and it is the lowest such number to do so.
// If your secret key is pqrstuv, the lowest number it combines with to make an MD5 hash starting
// with five zeroes is 1048970; that is, the MD5 hash of pqrstuv1048970 looks like 000006136ef....

// --- Part Two ---
// Now find one that starts with six zeroes.

function main() {
  let suffix = 1;
  let partOneDone = 0;
  let partTwoDone = 0;

  function* hasher() {
    while (true) {
      const md5 = crypto
        .createHash("md5")
        .update(input + String(suffix))
        .digest("hex");

      yield md5;

      suffix += 1;
    }
  }

  for (const hash of hasher()) {
    if (!partOneDone && hash.startsWith("00000")) {
      partOneDone = 1;
      console.log({ part1: suffix });
    }

    if (!partTwoDone && hash.startsWith("000000")) {
      partTwoDone = 1;
      console.log({ part2: suffix });
    }

    if (partOneDone && partTwoDone) {
      break;
    }
  }
}

main();
