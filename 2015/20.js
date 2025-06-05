import INPUT from './20.input.json' with { type: 'json' };

// function* houseGenerator() {
//   let house = 1;

//   while (true) {
//     let presents = 0;

//     for (let i = 1; i <= house; i++) {
//       if (house % i === 0) {
//         presents += i * 10;
//       }
//     }

//     if (presents >= INPUT) {
//       yield { ok: true, number: house };
//     }

//     house++;
//   }
// }

// // THIS IS SUPER SLOW APPROACH !!!
// function lowestHouseNumberPart1() {
//   for (const house of houseGenerator()) {
//     if (house?.ok) {
//       return house.number;
//     }
//   }
// }

function lowestHouseNumberPart2() {
  const houses = Array(INPUT / 20).fill(0);

  for (let elf = 1; elf < houses.length; elf++) {
    let housesVisited = 0;

    for (let i = elf; i < houses.length && housesVisited < 50; i += elf) {
      houses[i] += elf * 11;
      housesVisited += 1;
    }
  }

  for (let i = 0; i < houses.length; i++) {
    if (houses[i] >= INPUT) {
      return i;
    }
  }

  return -1;
}

// console.log({ part1: lowestHouseNumberPart1() });
console.log({ part2: lowestHouseNumberPart2() });
