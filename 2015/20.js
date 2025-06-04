import INPUT from './20.input.json' with { type: 'json' }

function* houseGenerator() {
  let house = 1;

  while (true) {
    let presents = 0;

    for (let i = 1; i <= house; i++) {
      if (house % i === 0) {
        presents += i * 10;
      }
    }

    if (presents >= INPUT) {
      yield { ok: true, number: house };
    }

    house++;
  }
}

// THIS IS SUPER SLOW APPROACH !!!
function lowestHouseNumber() {
  for (const house of houseGenerator()) {
    if (house?.ok) {
      return house.number;
    }
  }
}

console.log({ part1: lowestHouseNumber() });
