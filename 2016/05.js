import { input } from "./05.input.js";
import crypto from "node:crypto";

const targetLength = 8;

let password1 = "";

let password2 = Array(targetLength);
let filledCount = 0;

let index = 0;

while (filledCount < targetLength) {
  let hash = crypto
    .createHash("md5")
    .update(input + String(index++))
    .digest("hex");

  if (!hash.startsWith("00000")) {
    continue;
  }

  // Part 1
  if (password1.length < targetLength) {
    password1 += hash[5];
  }

  // Part 2
  const position = parseInt(hash[5], 10);

  if (
    !Number.isNaN(position) &&
    position >= 0 &&
    position < targetLength &&
    !password2[position]
  ) {
    password2[position] = hash[6];

    filledCount += 1;
  }
}

console.log({ password1, password2: password2.join("") });
