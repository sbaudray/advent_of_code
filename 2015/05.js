const fs = require("node:fs");
const path = require("node:path");
const { Writable } = require("node:stream");
const { pipeline } = require("node:stream/promises");
const readline = require("readline");

// Santa needs help figuring out which strings in his text file are naughty or nice.

// A nice string is one with all of the following properties:

// It contains at least three vowels (aeiou only), like aei, xazegov,
// or aeiouaeiouaeiou.
// It contains at least one letter that appears twice in a row,
// like xx, abcdde (dd), or aabbccdd (aa, bb, cc, or dd).
// It does not contain the strings ab, cd, pq, or xy,
// even if they are part of one of the other requirements.
// For example:

// ugknbfddgicrmopn is nice because it has at least three vowels
// (u...i...o...), a double letter (...dd...), and none of the disallowed substrings.
// aaa is nice because it has at least three vowels and a double letter,
// even though the letters used by different rules overlap.
// jchzalrnumimnmhp is naughty because it has no double letter.
// haegwjzuvuyypxyu is naughty because it contains the string xy.
// dvszwmarrgswjxmb is naughty because it contains only one vowel.
// How many strings are nice?

async function part1() {
  function isNiceString(str) {
    return (
      (str.match(/[aeiou]/g)?.length ?? 0) >= 3 &&
      !/ab|cd|pq|xy/.test(str) &&
      /([a-z])\1/.test(str)
    );
  }

  function StringsStream() {
    return readline.createInterface({
      input: fs.createReadStream(path.join(__dirname, "./05.input.txt")),
    });
  }

  function NiceStringsComputerStream() {
    let niceStrings = 0;

    return new Writable({
      objectMode: true,
      write(str, _, done) {
        if (isNiceString(str)) {
          niceStrings += 1;
        }

        done();
      },
      final(done) {
        console.log({ niceStrings });
        done();
      },
    });
  }

  await pipeline(StringsStream(), NiceStringsComputerStream());
}

part1().catch(console.error);
