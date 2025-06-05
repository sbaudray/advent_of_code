import fs from "node:fs/promises";
import path from "node:path";
import { SHOP } from "./21.shop.input.js";

const input = await fs.readFile(
  path.join(import.meta.dirname, "./21.input.txt"),
  "utf8"
);

const LINES = input.split("\n");

function make_permutations(
  list,
  n = list.length,
  current_permutation = [],
  permutations = [],
  used_elements = new Set()
) {
  if (current_permutation.length === n) {
    permutations.push(current_permutation.slice());

    return permutations;
  }

  for (let i = 0; i < list.length; i += 1) {
    const elem = list[i];
    if (!used_elements.has(elem)) {
      used_elements.add(elem);
      current_permutation.push(elem);
      make_permutations(
        list,
        n,
        current_permutation,
        permutations,
        used_elements
      );
      current_permutation.pop();
      used_elements.delete(elem);
    }
  }

  return permutations;
}

function parse_stats(lines) {
  const stats = {};

  for (const line of lines) {
    const [stat, amount] = line.split(":").map((str) => str.trim());

    switch (stat) {
      case "Hit Points":
        stats.hp = amount;
        break;
      case "Damage":
        stats.atk = amount;
        break;
      case "Armor":
        stats.def = amount;
        break;
      default:
        throw new Error("Wrong input");
    }
  }

  return stats;
}

const BOSS_STATS = parse_stats(LINES);

class Fighter {
  constructor(name, stats) {
    this.stats = stats;
    this.name = name;
    this.hp = stats.hp;
    this.atk = stats.atk;
    this.def = stats.def;
    this.items = [];
    this.gold_spent = 0;
  }

  attack(enemy) {
    enemy.hp -= Math.max(1, this.atk - enemy.def);
  }

  equip(item) {
    this.items.push(item);
    this.atk += item.damage;
    this.def += item.armor;
    this.gold_spent += item.cost;
  }

  equip_loadout(loadout) {
    for (const item of loadout) {
      this.equip(item);
    }
  }
}

function fight(player1, player2) {
  let fighters = [player1, player2];
  let turn = 0;

  while (true) {
    let attacker = fighters[turn];
    let defender = fighters[turn === 0 ? 1 : 0];

    attacker.attack(defender);

    if (defender.hp <= 0) {
      return attacker;
    }

    turn = turn === 0 ? 1 : 0;
  }
}

function make_loadouts(shop) {
  let loadouts = [];

  let weapons = shop.filter((x) => x.type === "weapon");
  let rings = shop.filter((x) => x.type === "rings");
  let armors = shop.filter((x) => x.type === "armor");

  const rings_combinations = [
    [],
    ...rings.map((ring) => [ring]),
    ...make_permutations(rings, 2),
  ];

  for (const weapon of weapons) {
    for (const armor of [null, ...armors]) {
      for (const rings of rings_combinations) {
        let loadout = [];

        loadout.push(weapon);

        armor ? loadout.push(armor) : void 0;

        loadout.push(...rings);

        loadouts.push(loadout);
      }
    }
  }

  return loadouts;
}

function get_fight_costs() {
  const loadouts = make_loadouts(SHOP);

  let costs = {
    winning_fights: new Set(),
    losing_fights: new Set(),
  };

  for (const loadout of loadouts) {
    const boss = new Fighter("Boss", BOSS_STATS);
    const player = new Fighter("Player", {
      hp: 100,
      atk: 0,
      def: 0,
    });

    player.equip_loadout(loadout);

    const winner = fight(player, boss);

    if (winner === player) {
      costs.winning_fights.add(player.gold_spent);
    } else {
      costs.losing_fights.add(player.gold_spent);
    }
  }

  return {
    minimum_to_win: Math.min(...costs.winning_fights),
    maximum_to_lose: Math.max(...costs.losing_fights),
  };
}

console.log({ part1: get_fight_costs().minimum_to_win });
console.log({ part2: get_fight_costs().maximum_to_lose });
