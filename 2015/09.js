import fs from "node:fs";
import path from "node:path";

const input = fs.readFileSync(
  path.join(import.meta.dirname, "./09.input.txt"),
  "utf8"
);

const lines = input.split("\n");

const travelRegex = /(?<from>\w+) to (?<to>\w+) = (?<distance>\d+)/;

function parseTravel(line) {
  const { groups } = line.match(travelRegex);

  return {
    from: groups.from,
    to: groups.to,
    distance: parseInt(groups.distance, 10),
  };
}

const travels = lines.map(parseTravel);

function addDestination(from, to, distance, map) {
  if (!map.has(from)) {
    map.set(from, new Map());
  }

  const destinations = map.get(from);

  if (!destinations.has(to)) {
    destinations.set(to, distance);
  }
}

function buildMap(travels) {
  const map = new Map();

  for (const { from, to, distance } of travels) {
    addDestination(from, to, distance, map);
    addDestination(to, from, distance, map);
  }

  return map;
}

function travel({
  from,
  visited = new Set(),
  map,
  distances,
  currentDistance = 0,
}) {
  visited.add(from);

  const destinations = map.get(from);

  let hasTravelled = false;

  for (const [to, distance] of destinations) {
    if (visited.has(to)) {
      continue;
    }

    travel({
      from: to,
      visited,
      map,
      distances,
      currentDistance: currentDistance + distance,
    });

    hasTravelled = true;
  }

  visited.delete(from);

  if (hasTravelled) {
    return;
  }

  distances.push(currentDistance);

  return true;
}

function part1() {
  const map = buildMap(travels);

  let distances = [];

  for (const city of map.keys()) {
    travel({ from: city, map, distances });
  }

  return Math.min.apply(null, distances);
}

function part2() {
  const map = buildMap(travels);

  let distances = [];

  for (const city of map.keys()) {
    travel({ from: city, map, distances });
  }

  return Math.max.apply(null, distances);
}

console.log({ part1: part1(lines) });
console.log({ part2: part2(lines) });
