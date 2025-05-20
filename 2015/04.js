const input = require("./04.input.json");
const crypto = require("node:crypto");

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
