import fs from "node:fs/promises";
import path from "node:path";
import { SPELLS } from "./22.spells.input.js";

const input = await fs.readFile(
  path.join(import.meta.dirname, "./22.input.txt"),
  "utf8"
);

const lines = input.split("\n");

function parseStats(lines) {
  let stats = {};

  for (const line of lines) {
    const [stat, amount] = line.split(":").map((str) => str.trim());

    switch (stat) {
      case "Hit Points":
        stats.hp = amount;
        break;
      case "Damage":
        stats.atk = amount;
        break;
      default:
        throw new Error("Wrong input");
    }
  }

  return stats;
}

const BOSS_STATS = parseStats(lines);

console.log(BOSS_STATS);

class Fighter {
  spells = new Map();

  constructor(stats) {
    const { hp, atk, mana } = stats;

    this.hp = hp;
    this.atk = atk;
    this.mana = mana;
  }

  learnSpell(spell) {
    this.spells.set(spell.name, {
      effects: spell.effects,
      manaCost: spell.manaCost,
    });
  }

  castSpell(name) {
    const spell = this.spells.get(name);

    if (!spell) {
      throw new Error("Wrong spell");
    }

    if (spell.manaCost > this.mana) {
      console.log(`no mana`);
      return false;
    }

    this.mana -= spell.manaCost;

    for (const effect of spell.effects) {
      this.playEffect(effect);
    }
  }

  playEffect(effect) {
    if (effect.turns === 0) {
      this.instantCast(effect);
      return;
    }
  }

  instantCast(effect) {
    switch (effect.type) {
      case "damge":
        console.log(`Instant damage enemy for ${effect.amount}`);
        break;
      case "self_heal":
        console.log(`Instant self heal for ${effect.amount}`);
        break;
      default:
        throw Error(`Cannot instantCast ${JSON.stringify(effect)}`);
    }
  }
}
const foo = Error("mesage");
const bar = new Error("mesage");

const boss = new Fighter({ hp: BOSS_STATS.hp, atk: BOSS_STATS.atk });
const wizard = new Fighter({ hp: 50, mana: 500 });

for (const spell of SPELLS) {
  wizard.learnSpell(spell);
}

console.log(wizard);
wizard.castSpell("magic_missile");
wizard.castSpell("magic_missile");
wizard.castSpell("magic_missile");
wizard.castSpell("magic_missile");
wizard.castSpell("magic_missile");
wizard.castSpell("magic_missile");
wizard.castSpell("magic_missile");
wizard.castSpell("magic_missile");
wizard.castSpell("magic_missile");
wizard.castSpell("magic_missile");
wizard.castSpell("magic_missile");
