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

class Fighter {
  spells = new Map();
  effects = new Map();

  constructor(stats) {
    const { hp, atk, mana } = stats;

    this.initialStats = stats;
    this.hp = hp;
    this.atk = atk;
    this.armor = 0;
    this.mana = mana;
    this.manaSpent = 0;
  }

  clone() {
    const clone = new Fighter(this.initialStats);
    clone.hp = this.hp;
    clone.atk = this.atk;
    clone.armor = this.armor;
    clone.mana = this.mana;
    clone.manaSpent = this.manaSpent;
    clone.spells = this.spells;
    clone.effects = structuredClone(this.effects);

    return clone;
  }

  learnSpell(spell) {
    this.spells.set(spell.name, spell);
  }

  cast(spellName, enemy) {
    const spell = this.spells.get(spellName);

    if (spell.manaCost > this.mana) {
      return { failure: "NO_MANA" };
    }

    if (this.effects.has(spellName)) {
      return { failure: "EFFECT_RUNNING" };
    }

    this.mana -= spell.manaCost;
    this.manaSpent += spell.manaCost;

    if (spell.actions) {
      this.runActions(spell.actions, enemy);
    }

    if (spell.effect) {
      this.effects.set(spellName, structuredClone(spell.effect));
    }
  }

  runActions(actions, enemy) {
    for (const action of actions) {
      switch (action.type) {
        case "damage":
          enemy.takeDamage(action.amount);
          break;
        case "self_heal":
          this.hp = Math.min(this.initialStats.hp, this.hp + action.amount);
          break;
        default:
          throw Error(`Cannot run action ${JSON.stringify(action)}`);
      }
    }
  }

  debuff() {
    this.armor = 0;
  }

  startOfTurn(enemy) {
    this.debuff();

    for (const [name, effect] of this.effects) {
      switch (effect.type) {
        case "armor_gain":
          this.armor += effect.amount;
          break;
        case "mana_gain":
          this.mana += effect.amount;
          break;
        case "damage":
          enemy.takeDamage(effect.amount);
          break;
        default:
          throw new Error(`Cannot run effect `);
      }

      effect.turns = effect.turns - 1;

      if (effect.turns === 0) {
        this.effects.delete(name);
      }
    }
  }

  takeDamage(amount) {
    this.hp -= Math.max(1, amount - this.armor);
  }
}

function simulateFights(
  wizard,
  boss,
  options,
  result = { leastManaSpent: Infinity }
) {
  if (boss.hp <= 0) {
    if (wizard.manaSpent < result.leastManaSpent) {
      result.leastManaSpent = wizard.manaSpent;
    }

    return;
  }

  if (wizard.manaSpent > result.leastManaSpent || wizard.hp <= 0) {
    return;
  }

  for (const spell of SPELLS) {
    const wizardClone = wizard.clone();
    const bossClone = boss.clone();

    if (options.hard) {
      wizardClone.hp -= 1;
      if (wizardClone.hp <= 0) {
        continue;
      }
    }

    wizardClone.startOfTurn(bossClone);

    const cast = wizardClone.cast(spell.name, bossClone);

    if (cast?.failure) {
      continue;
    }

    wizardClone.startOfTurn(bossClone);
    wizardClone.takeDamage(bossClone.atk);

    simulateFights(wizardClone, bossClone, options, result);
  }

  return result.leastManaSpent;
}

function findLeastManaSpentToWin({ hard = false } = {}) {
  const boss = new Fighter({ hp: BOSS_STATS.hp, atk: BOSS_STATS.atk });
  const wizard = new Fighter({ hp: 50, mana: 500 });

  for (const spell of SPELLS) {
    wizard.learnSpell(spell);
  }

  const leastManaSpent = simulateFights(wizard, boss, { hard });

  return leastManaSpent;
}

console.log({
  part1: findLeastManaSpentToWin(),
  part2: findLeastManaSpentToWin({ hard: true }),
});
