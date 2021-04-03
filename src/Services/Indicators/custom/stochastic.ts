import { CandleStickInterface } from "../../../Interfaces/cryptos";

export const calculateStochastic = (
  candleSticks: Array<CandleStickInterface>
): number => {
  const closingPrices = candleSticks.map((candle) => candle.prices.close);
  let minPrice = closingPrices[0];
  let maxPrice = closingPrices[0];
  for (const price of closingPrices) {
    if (price > maxPrice) {
      maxPrice = price;
    } else if (price < minPrice) {
      minPrice = price;
    }
  }
  const stochastic =
    ((closingPrices[closingPrices.length - 1] - minPrice) /
      (maxPrice - minPrice)) *
    100;
  return +stochastic.toFixed(2);
};
