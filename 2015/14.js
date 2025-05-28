import fs from "node:fs/promises";
import path from "node:path";

const input = await fs.readFile(
  path.join(import.meta.dirname, "./14.input.txt"),
  "utf8"
);

const lines = input.split("\n");

const deerStatsRegex =
  /\w+ can fly (?<speedInKmPerSecond>\d+) km\/s for (?<staminaInSeconds>\d+) seconds, but then must rest for (?<restingTimeInSeconds>\d+) seconds./;

function parseDeerStats(line) {
  const { groups } = line.match(deerStatsRegex);

  return {
    speedInKmPerSecond: parseInt(groups.speedInKmPerSecond, 10),
    staminaInSeconds: parseInt(groups.staminaInSeconds, 10),
    restingTimeInSeconds: parseInt(groups.restingTimeInSeconds, 10),
  };
}

function getMostDistanceTravelled({ deerStats, timeInSeconds }) {
  let maxDistance = 0;

  for (const {
    speedInKmPerSecond,
    staminaInSeconds,
    restingTimeInSeconds,
  } of deerStats) {
    const cycleTimeInSeconds = staminaInSeconds + restingTimeInSeconds;
    const fullCycles = Math.floor(timeInSeconds / cycleTimeInSeconds);
    const remainingSeconds = timeInSeconds % cycleTimeInSeconds;
    const secondsToRunAfterFullCycles = Math.min(
      remainingSeconds,
      staminaInSeconds
    );

    const distance =
      fullCycles * speedInKmPerSecond * staminaInSeconds +
      speedInKmPerSecond * secondsToRunAfterFullCycles;

    if (distance > maxDistance) {
      maxDistance = distance;
    }
  }

  return maxDistance;
}

function part1(lines) {
  const deerStats = lines.map((line) => parseDeerStats(line));
  const timeInSeconds = 2503;

  const mostDistanceTravelled = getMostDistanceTravelled({
    deerStats,
    timeInSeconds,
  });

  return mostDistanceTravelled;
}

console.log({ part1: part1(lines) });
