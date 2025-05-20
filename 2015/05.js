import fs from "node:fs";
import path, { dirname } from "node:path";
import { Writable } from "node:stream";
import { pipeline } from "node:stream/promises";
import readline from "readline";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

function StringsStream() {
  return readline.createInterface({
    input: fs.createReadStream(path.join(__dirname, "./05.input.txt")),
  });
}

function PredicateCounterStream({ predicate, label }) {
  let count = 0;

  return new Writable({
    objectMode: true,
    write(str, _, done) {
      if (predicate(str)) {
        count += 1;
      }

      done();
    },
    final(done) {
      console.log({ [label]: count });
      done();
    },
  });
}

async function part1() {
  function isNiceString(str) {
    return (
      (str.match(/[aeiou]/g)?.length ?? 0) >= 3 &&
      !/ab|cd|pq|xy/.test(str) &&
      /([a-z])\1/.test(str)
    );
  }

  await pipeline(
    StringsStream(),
    PredicateCounterStream({ label: "part1", predicate: isNiceString })
  );
}

export function isNiceStringPart2(str) {
  return /([a-z][a-z]).*\1/g.test(str) && /([a-z])[a-z]\1/.test(str);
}

async function part2() {
  await pipeline(
    StringsStream(),
    PredicateCounterStream({ label: "part2", predicate: isNiceStringPart2 })
  );
}

part1().catch(console.error);
part2().catch(console.error);
