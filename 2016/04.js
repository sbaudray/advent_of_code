import fs from "node:fs/promises";
import path from "node:path";

const input = await fs.readFile(
  path.join(import.meta.dirname, "./04.input.txt"),
  "utf8"
);

const lines = input.split("\n");

const roomRegex = /(?<name>.*)-(?<sectorId>\d+)\[(?<checksum>[a-z]+)\]/;

const alphabet = "abcdefghijklmnopqrstuvwxyz";

function rotate(char, times) {
  const nextIndex = (alphabet.indexOf(char) + times) % alphabet.length;
  return alphabet[nextIndex];
}

function decode(name, sectorId) {
  let decoded = "";

  for (const char of name) {
    if (char === "-") {
      decoded += " ";
      continue;
    }

    decoded += rotate(char, parseInt(sectorId, 10));
  }

  return decoded;
}

function isValidChecksum(name, checksum) {
  const charCountMap = new Map();

  for (const char of name) {
    if (char === "-") {
      continue;
    }

    if (charCountMap.has(char)) {
      charCountMap.set(char, charCountMap.get(char) + 1);
    } else {
      charCountMap.set(char, 1);
    }
  }

  const sorted = [...charCountMap].sort(([charA, countA], [charB, countB]) => {
    if (countA === countB) {
      return charA > charB ? 1 : -1;
    }

    return countB - countA;
  });

  const fiveMostCommonLetters = sorted
    .slice(0, 5)
    .map((x) => x[0])
    .join("");

  if (checksum === fiveMostCommonLetters) {
    return true;
  }

  return false;
}

let sectorIdSum = 0;
let northpoleObjectStorageSectorId;

for (const line of lines) {
  const {
    groups: { name, sectorId, checksum },
  } = line.match(roomRegex);

  const decoded = decode(name, sectorId);

  if (decoded.includes("northpole") && decoded.includes("storage")) {
    northpoleObjectStorageSectorId = parseInt(sectorId, 10);
  }

  if (isValidChecksum(name, checksum)) {
    sectorIdSum += parseInt(sectorId, 10);
  }
}

console.log({ sectorIdSum, northpoleObjectStorageSectorId });
