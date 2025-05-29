import fs from "node:fs/promises";
import path from "node:path";

const input = await fs.readFile(
  path.join(import.meta.dirname, "./15.input.txt"),
  "utf8"
);

const lines = input.split("\n");

const ingredientRegex =
  /(?<name>\w+): capacity (?<capacity>-?\d+), durability (?<durability>-?\d+), flavor (?<flavor>-?\d+), texture (?<texture>-?\d+), calories (?<calories>-?\d+)/;

function parseIngredient(line) {
  const { groups } = line.match(ingredientRegex);

  return {
    name: groups.name,
    capacity: parseInt(groups.capacity, 10),
    durability: parseInt(groups.durability, 10),
    flavor: parseInt(groups.flavor, 10),
    texture: parseInt(groups.texture, 10),
    calories: parseInt(groups.calories, 10),
  };
}

const TEA_SPOONS = 100;

class Batch {
  recipe = new Map();
  teaspoons = 0;

  addIngredient(ingredient, quantity = 1) {
    this.teaspoons += quantity;
    this.recipe.set(ingredient, quantity);
  }

  removeIngredient(ingredient) {
    this.teaspoons -= this.recipe.get(ingredient);
    this.recipe.delete(ingredient);
  }

  hasIngredient(ingredient) {
    return this.recipe.has(ingredient);
  }

  cook() {
    let batch = {
      capacity: 0,
      durability: 0,
      flavor: 0,
      texture: 0,
    };

    for (const [ingredient, quantity] of this.recipe) {
      batch.capacity += ingredient.capacity * quantity;
      batch.durability += ingredient.durability * quantity;
      batch.flavor += ingredient.flavor * quantity;
      batch.texture += ingredient.texture * quantity;
    }

    return batch;
  }
}

function getBatchScore(batch) {
  return (
    Math.max(0, batch.durability) *
    Math.max(0, batch.flavor) *
    Math.max(0, batch.capacity) *
    Math.max(0, batch.texture)
  );
}

function cook(
  ingredients,
  state = { bestScore: 0 },
  currentBatch = new Batch(),
  currentIngredientIndex = 0
) {
  if (currentIngredientIndex === ingredients.length) {
    if (currentBatch.teaspoons !== TEA_SPOONS) {
      return;
    }

    const batch = currentBatch.cook();
    const score = getBatchScore(batch);

    if (score > state.bestScore) {
      state.bestScore = score;
    }

    return;
  }

  const currentIngredient = ingredients[currentIngredientIndex];

  for (
    let quantity = 0;
    quantity <= TEA_SPOONS - currentBatch.teaspoons;
    quantity++
  ) {
    currentBatch.addIngredient(currentIngredient, quantity);

    cook(ingredients, state, currentBatch, currentIngredientIndex + 1);

    currentBatch.removeIngredient(currentIngredient);
  }

  return state.bestScore;
}

function part1(lines) {
  const ingredients = lines.map(parseIngredient);

  return cook(ingredients);
}

console.log({ part1: part1(lines) });
