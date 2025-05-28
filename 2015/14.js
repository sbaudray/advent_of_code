import fs from "node:fs/promises";
import path from "node:path";

const input = await fs.readFile(
  path.join(import.meta.dirname, "./14.input.txt"),
  "utf8"
);

const lines = input.split("\n");

const deerProfileRegex =
  /(?<name>\w+) can fly (?<speedInKmPerSecond>\d+) km\/s for (?<staminaInSeconds>\d+) seconds, but then must rest for (?<restingTimeInSeconds>\d+) seconds./;

function parseDeerProfile(line) {
  const { groups } = line.match(deerProfileRegex);

  return {
    name: groups.name,
    speedInKmPerSecond: parseInt(groups.speedInKmPerSecond, 10),
    staminaInSeconds: parseInt(groups.staminaInSeconds, 10),
    restingTimeInSeconds: parseInt(groups.restingTimeInSeconds, 10),
  };
}

const DEER_PROFILES = lines.map(parseDeerProfile);

const RACE_TIME_IN_SECONDS = 2503;

function getMostDistanceTravelled({ deerprofile, timeInSeconds }) {
  let maxDistance = 0;

  for (const {
    speedInKmPerSecond,
    staminaInSeconds,
    restingTimeInSeconds,
  } of deerprofile) {
    const cycleTimeInSeconds = staminaInSeconds + restingTimeInSeconds;
    const fullCycles = Math.floor(timeInSeconds / cycleTimeInSeconds);
    const remainingSeconds = timeInSeconds % cycleTimeInSeconds;
    const secondsToFlyAfterFullCycles = Math.min(
      remainingSeconds,
      staminaInSeconds
    );

    const distance =
      fullCycles * speedInKmPerSecond * staminaInSeconds +
      speedInKmPerSecond * secondsToFlyAfterFullCycles;

    if (distance > maxDistance) {
      maxDistance = distance;
    }
  }

  return maxDistance;
}

function part1() {
  const mostDistanceTravelled = getMostDistanceTravelled({
    deerprofile: DEER_PROFILES,
    timeInSeconds: RACE_TIME_IN_SECONDS,
  });

  return mostDistanceTravelled;
}

class Reindeer {
  flying = true;
  timerInSeconds = 0;
  distanceTravelledInKm = 0;

  constructor(profile) {
    this.profile = profile;
  }

  move() {
    this.timerInSeconds += 1;

    if (this.flying === true) {
      this.distanceTravelledInKm += this.profile.speedInKmPerSecond;
    }

    const fullCycleInSeconds =
      this.profile.staminaInSeconds + this.profile.restingTimeInSeconds;

    if (
      this.timerInSeconds % fullCycleInSeconds ===
      this.profile.staminaInSeconds
    ) {
      this.flying = false;
    } else if (this.timerInSeconds % fullCycleInSeconds === 0) {
      this.flying = true;
    }

    return this;
  }

  get distanceTravelledInKm() {
    return this.distanceTravelledInKm;
  }
}

function race() {
  const racers = [];
  const leaderboard = new Map();

  for (const profile of DEER_PROFILES) {
    const deer = new Reindeer(profile);
    racers.push(deer);
    leaderboard.set(deer, 0);
  }

  for (let i = 0; i < RACE_TIME_IN_SECONDS; i += 1) {
    let distanceTravelledByLeadersInKm = 0;

    for (const racer of racers) {
      racer.move();

      if (racer.distanceTravelledInKm > distanceTravelledByLeadersInKm) {
        distanceTravelledByLeadersInKm = racer.distanceTravelledInKm;
      }
    }

    for (const [deer, score] of leaderboard) {
      if (deer.distanceTravelledInKm === distanceTravelledByLeadersInKm) {
        leaderboard.set(deer, score + 1);
      }
    }
  }

  return leaderboard;
}

function part2() {
  const leaderboard = race();

  let bestScore = 0;

  for (const [_deer, score] of leaderboard) {
    if (score > bestScore) {
      bestScore = score;
    }
  }

  return bestScore;
}

console.log({ part1: part1(), part2: part2() });
