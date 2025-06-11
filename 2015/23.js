import fs from "node:fs/promises";
import path from "node:path";

const input = await fs.readFile(
  path.join(import.meta.dirname, "./23.input.txt"),
  "utf8"
);

const lines = input.split("\n");

const instructionRegex =
  /(?<command>jmp|inc|tpl|jio|jie|hlf) (?<register>[a-z])?(,?\s?(?<direction>[+-])(?<jump>\d+))?/;

function parseInstruction(line) {
  const { groups } = line.match(instructionRegex);

  let jump;

  if (groups.direction && groups.jump) {
    const parsed = parseInt(groups.jump, 10);

    jump = groups.direction === "+" ? parsed : -parsed;
  }

  return {
    command: groups.command,
    register: groups.register,
    jump,
  };
}

const INSTRUCTIONS = lines.map(parseInstruction);

function getRegister() {
  let register = new Map();

  register.set("a", 0);
  register.set("b", 0);

  let i = 0;

  while (i >= 0 && i < INSTRUCTIONS.length) {
    const instruction = INSTRUCTIONS[i];

    switch (instruction.command) {
      case "hlf": {
        const val = register.get(instruction.register);
        register.set(instruction.register, val / 2);
        break;
      }
      case "tpl": {
        const val = register.get(instruction.register);
        register.set(instruction.register, val * 3);
        break;
      }
      case "inc": {
        const val = register.get(instruction.register);
        register.set(instruction.register, val + 1);
        break;
      }
      case "jmp": {
        i += instruction.jump;
        continue;
      }
      case "jie": {
        const val = register.get(instruction.register);

        if (val % 2 === 0) {
          i += instruction.jump;
          continue;
        }

        break;
      }
      case "jio": {
        const val = register.get(instruction.register);

        if (val === 1) {
          i += instruction.jump;
          continue;
        }

        break;
      }
      default: {
        throw new Error(`Unhandled instruction ${JSON.stringify(instruction)}`);
      }
    }

    i++;
  }

  return register;
}

console.log(getRegister());
