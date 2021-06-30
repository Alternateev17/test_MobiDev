const prices = [100.0, 112.2, 301.1];
const discounts = [10.0, 0.0, 0.0];

class Discounts {
  constructor(prices, discounts) {

    this.prices = prices;
    this.discounts = discounts;
  }
  getTotalPrice() {
    let prices_in_cents = this.prices.map(price => price*100);
    let prices_applied_discount = prices_in_cents.map(
      (price, i) => price - price*this.discounts[i]/100
    );
    let total_in_cents = prices_applied_discount.reduce(
      (sum, total_accumulator) => sum + total_accumulator,
      0
    );
    return (total_in_cents/100).toFixed(1);
  }
}

const disc = new Discounts(prices, discounts);
console.log(disc.getTotalPrice());
