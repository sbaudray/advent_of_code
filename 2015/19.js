import fs from "node:fs/promises";
import path from "node:path";

const input = await fs.readFile(
  path.join(import.meta.dirname, "./19.input.txt"),
  "utf8"
);

const lines = input.split("\n");

const REPLACEMENTS = lines
  .slice(0, -2)
  .map((line) => line.replace(/\s/g, "").split("=>"));

const STARTING_MOLECULE = lines[lines.length - 1];

function findMolecules() {
  let uniqMolecules = new Set();

  function lookAhead({
    initialInputIndex,
    lookAheadIndex,
    inputIndex,
    replaced,
    replacedBy,
  }) {
    if (lookAheadIndex === replaced.length) {
      const newMolecule = [...STARTING_MOLECULE];
      newMolecule.splice(initialInputIndex, replaced.length, replacedBy);

      uniqMolecules.add(newMolecule.join(""));
      return;
    }

    if (STARTING_MOLECULE[inputIndex] === replaced[lookAheadIndex]) {
      lookAhead({
        initialInputIndex,
        inputIndex: inputIndex + 1,
        lookAheadIndex: lookAheadIndex + 1,
        replaced,
        replacedBy,
      });
    }
  }

  for (let i = 0; i < STARTING_MOLECULE.length; i++) {
    for (const replacement of REPLACEMENTS) {
      lookAhead({
        initialInputIndex: i,
        lookAheadIndex: 0,
        inputIndex: i,
        replaced: replacement[0],
        replacedBy: replacement[1],
      });
    }
  }

  return uniqMolecules.size;
}

console.log({ part1: findMolecules() });
