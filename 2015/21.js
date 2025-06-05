import fs from "node:fs/promises";
import path from "node:path";
import { SHOP } from "./21.shop.input.js";

const input = await fs.readFile(
  path.join(import.meta.dirname, "./21.input.txt"),
  "utf8"
);

const LINES = input.split("\n");

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

  revive() {
    this.hp = this.stats.hp;
  }

  attack(enemy) {
    enemy.hp -= Math.max(1, this.atk - enemy.def);
  }

  equip(item) {
    if (item.type === "weapon" && this.items.some((x) => x.type === "weapon")) {
      return false;
    }

    if (item.type === "armor" && this.items.some((x) => x.type === "armor")) {
      return false;
    }

    if (
      (item.type === "rings" &&
        this.items.filter((x) => x.type === "rings").length === 2) ||
      this.items.some((x) => x === item)
    ) {
      return false;
    }

    this.items.push(item);
    this.atk += item.damage;
    this.def += item.armor;
    this.gold_spent += item.cost;

    return true;
  }

  abandon(item) {
    this.items = this.items.filter((x) => x !== item);
    this.atk -= item.damage;
    this.def -= item.armor;
    this.gold_spent -= item.cost;
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
      defender.revive();
      attacker.revive();
      return attacker;
    }

    turn = turn === 0 ? 1 : 0;
  }
}

function fight_and_buy(player, boss, shop, winner_costs = new Set()) {
  const winner = fight(player, boss);

  if (winner === player) {
    winner_costs.add(winner.gold_spent);
  }

  for (const item of shop) {
    const equipped = player.equip(item);

    if (!equipped) {
      continue;
    }

    fight_and_buy(player, boss, shop, winner_costs);

    player.abandon(item);
  }

  return winner_costs;
}

function minimum_gold_spent_to_win() {
  const boss = new Fighter("Boss", BOSS_STATS);
  const player = new Fighter("Player", { hp: 100, atk: 0, def: 0 });

  const winner_costs = fight_and_buy(player, boss, SHOP);

  return Math.min(...winner_costs);
}

console.log({ part1: minimum_gold_spent_to_win() });
