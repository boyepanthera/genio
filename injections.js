const Rounder = (number, decimal) => {
  let zeros = String((1.0).toFixed(decimal));
  zeros = zeros.substr(2);
  let productDiv = parseInt("1" + zeros);
  let increment = parseFloat("." + zeros + "01");
  if ((number * (productDiv * 10)) % 10 >= 5) {
    number += increment;
  }
  return Math.round(number * productDiv) / productDiv;
};

module.exports = { Rounder };
