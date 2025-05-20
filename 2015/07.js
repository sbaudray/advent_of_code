import readline from "readline";
import { pipeline } from "stream/promises";
import fs from "node:fs";
import { fileURLToPath } from "node:url";
import path, { dirname } from "node:path";
import { Transform, Writable } from "node:stream";

const filename = fileURLToPath(import.meta.url);
const __dirname = dirname(filename);

function InstructionsStream() {
  return readline.createInterface({
    input: fs.createReadStream(path.join(__dirname, "./07.input.txt")),
  });
}

const instructionRegex =
  /(?<wire1>[a-z]+)?(?<value1>\d+)?\s?(?<gate>NOT|OR|AND|RSHIFT|LSHIFT)?\s?(?<wire2>[a-z]+)?(?<value2>\d+)? -> (?<destination>[a-z]+)/;

function parseInstruction(instructionString) {
  const { groups } = instructionString.match(instructionRegex);

  return {
    gate: groups.gate ?? "ASSIGN",
    value1: groups.value1 ? parseInt(groups.value1, 10) : undefined,
    value2: groups.value2 ? parseInt(groups.value2, 10) : undefined,
    wire1: groups.wire1,
    wire2: groups.wire2,
    destination: groups.destination,
  };
}

function InstructionParserStream() {
  return new Transform({
    objectMode: true,
    transform(instructionString, _, done) {
      done(null, parseInstruction(instructionString));
    },
  });
}

function CollectorStream({ collection }) {
  return new Writable({
    objectMode: true,
    write(data, _, done) {
      collection.push(data);
      done();
    },
  });
}

function run(instruction, signals, { ignoreWireB } = {}) {
  const { value1, value2, wire1, wire2, destination, gate } = instruction;

  if (ignoreWireB && destination === "b") {
    return true;
  }

  const signal1 = signals[wire1] ?? value1;
  const signal2 = signals[wire2] ?? value2;

  switch (gate) {
    case "NOT": {
      if (signal2 === undefined) {
        return false;
      }

      signals[destination] = 2 ** 16 + ~signal2;
      return true;
    }
    case "AND": {
      if (signal1 === undefined || signal2 === undefined) {
        return false;
      }

      signals[destination] = signal1 & signal2;

      return true;
    }
    case "OR": {
      if (signal1 === undefined || signal2 === undefined) {
        return false;
      }

      signals[destination] = signal1 | signal2;

      return true;
    }
    case "LSHIFT": {
      if (signal1 === undefined) {
        return false;
      }

      signals[destination] = signal1 << signal2;

      return true;
    }
    case "RSHIFT": {
      if (signal1 === undefined || signal2 === undefined) {
        return false;
      }

      signals[destination] = signal1 >>> signal2;

      return true;
    }
    case "ASSIGN": {
      if (signal1 === undefined) {
        return false;
      }

      signals[destination] = signal1;
      return true;
    }
    default:
      throw new Error(JSON.stringify(instruction));
  }
}

function runInstructionsUntilAllSignalsAssigned(
  instructions,
  signals,
  options
) {
  let unrun = [];

  while (instructions.length > 0) {
    let runs = instructions.length;

    for (let i = 0; i < runs; i += 1) {
      const instruction = instructions.shift();

      const result = run(instruction, signals, options);

      if (!result) {
        unrun.push(instruction);
      }
    }

    instructions = unrun;
    unrun = [];
  }
}

async function part1() {
  let signals = {};
  let instructions = [];

  await pipeline(
    InstructionsStream(),
    InstructionParserStream(),
    CollectorStream({ collection: instructions })
  );

  runInstructionsUntilAllSignalsAssigned(instructions, signals);

  return signals.a;
}

const part1Result = await part1().catch(console.error);

async function part2(part1Result) {
  const signals = { b: part1Result };
  let instructions = [];

  await pipeline(
    InstructionsStream(),
    InstructionParserStream(),
    CollectorStream({ collection: instructions })
  );

  runInstructionsUntilAllSignalsAssigned(instructions, signals, {
    ignoreWireB: true,
  });

  console.log(instructions.length);

  return signals.a;
}

const part2Result = await part2(part1Result);

console.log({ part1: part1Result });
console.log({ part2: part2Result });
