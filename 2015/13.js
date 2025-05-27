import fs from "node:fs/promises";
import path from "node:path";

const input = await fs.readFile(
  path.join(import.meta.dirname, "./13.input.txt"),
  "utf8"
);

const lines = input.split("\n");

const factRegex =
  /(?<name1>\w+) would (?<direction>gain|lose) (?<amount>\d+) happiness units by sitting next to (?<name2>\w+)./;

function parseFact(fact) {
  const { groups } = fact.match(factRegex);

  const amount = parseInt(groups.amount, 10);

  return {
    name1: groups.name1,
    name2: groups.name2,
    amount: groups.direction === "gain" ? +amount : -amount,
  };
}

function mapGuestPairToHappinessAmount(facts) {
  const map = {};

  for (const fact of facts) {
    const { name1, name2, amount } = fact;
    map[[name1, name2]] = amount;
  }

  return map;
}

function makeGuestSet(facts) {
  const guestList = new Set();

  for (const fact of facts) {
    guestList.add(fact.name1);
    guestList.add(fact.name2);
  }

  return guestList;
}

function makePermutations(
  list,
  currentPermutation = [],
  permutations = [],
  usedElements = new Set()
) {
  if (currentPermutation.length === list.length) {
    permutations.push(currentPermutation.slice());

    return permutations;
  }

  for (let i = 0; i < list.length; i += 1) {
    const elem = list[i];
    if (!usedElements.has(elem)) {
      usedElements.add(elem);
      currentPermutation.push(elem);
      makePermutations(list, currentPermutation, permutations, usedElements);
      currentPermutation.pop();
      usedElements.delete(elem);
    }
  }

  return permutations;
}

function computeTableHappiness({ table, guestPairToHappinessMap }) {
  let happiness = 0;

  for (let i = 0; i < table.length; i += 1) {
    let currentGuest = table[i];
    let previousGuest = i === 0 ? table[table.length - 1] : table[i - 1];
    let nextGuest = table[(i + 1) % table.length];

    let happiness1 = guestPairToHappinessMap[[currentGuest, previousGuest]];
    let happiness2 = guestPairToHappinessMap[[currentGuest, nextGuest]];

    happiness += happiness1 + happiness2;
  }

  return happiness;
}

function getMaxHappiness({ tables, guestPairToHappinessMap }) {
  let maxHappiness = 0;

  for (let i = 0; i < tables.length; i += 1) {
    const tableHappiness = computeTableHappiness({
      table: tables[i],
      guestPairToHappinessMap,
    });

    if (tableHappiness > maxHappiness) {
      maxHappiness = tableHappiness;
    }
  }

  return maxHappiness;
}

function part1(lines) {
  const facts = lines.map(parseFact);
  const guestSet = makeGuestSet(facts);
  const guestPairToHappinessMap = mapGuestPairToHappinessAmount(facts);
  const tables = makePermutations(Array.from(guestSet));
  return getMaxHappiness({ tables, guestPairToHappinessMap });
}

function part2(lines) {
  const facts = lines.map(parseFact);
  const guestSet = makeGuestSet(facts);
  const guestPairToHappinessMap = mapGuestPairToHappinessAmount(facts);

  for (const guest of guestSet) {
    guestPairToHappinessMap[["me", guest]] = 0;
    guestPairToHappinessMap[[guest, "me"]] = 0;
  }

  guestSet.add("me");

  const tables = makePermutations(Array.from(guestSet));

  return getMaxHappiness({ tables, guestPairToHappinessMap });
}

console.log({ part1: part1(lines), part2: part2(lines) });
