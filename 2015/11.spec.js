import { describe, it } from "node:test";
import { isValidPassword } from "./11.js";
import assert from "node:assert";

describe("isValidPassword", () => {
  it("should return true when password is valid, false otherwise", () => {
    assert.equal(isValidPassword("abcdffaa"), true);
    assert.equal(isValidPassword("ghjaabcc"), true);

    assert.equal(isValidPassword("hijklmmn"), false);
    assert.equal(isValidPassword("abbceffg"), false);
    assert.equal(isValidPassword("abbcegjk"), false);
  });
});
