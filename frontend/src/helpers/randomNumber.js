import random from "random";
/**
 * Generate Random Number
 * @returns {number}
 */
function randomNumber() {
  // multiplier to make the number either have 5-12 digits
  const multiplier = [
    100000, 1000000, 10000000, 100000000, 1000000000, 10000000000, 100000000000,
    1000000000000,
  ];
  let num = random.float() * multiplier[random.int(0, 7)];
  return Math.round(num);
}

/**
 * Generate Random Integer
 * @param {number} low 
 * @param {number} high 
 * @returns {number}
 */
function randomInteger(low, high) {
  return random.int(low, high);
}

export {randomNumber, randomInteger};
