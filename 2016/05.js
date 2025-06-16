import { input } from "./05.input.js";
import crypto from "node:crypto";

let index = 0;

let password = "";

while (password.length !== 8) {
  let hash = crypto
    .createHash("md5")
    .update(input + String(index))
    .digest("hex");

  if (hash.startsWith("00000")) {
    password += hash[5];
  }

  index++;
}

console.log({ password });
