import { describe, it } from "node:test";
import { isNiceStringPart2 } from "./05.js";

describe("isNiceStringPart2", () => {
  it("returns true if string is nice, returns false otherwise", (t) => {
    t.assert.equal(isNiceStringPart2("qjhvhtzxzqqjkmpb"), true);
    t.assert.equal(isNiceStringPart2("xxyxx"), true);

    t.assert.equal(isNiceStringPart2("uurcxstgmygtbstg"), false);
    t.assert.equal(isNiceStringPart2("ieodomkazucvgmuy"), false);
  });
});
