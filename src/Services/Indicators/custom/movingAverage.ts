import { BinanceCandleStickInterface } from "../../../Interfaces/binance";

/**
 *
 * @param candleSticks every candles to use in the calculation of the MA
 * The number of periodes is determined by the the candles themself
 */
export const calculateMovingAverage = (
  candleSticks: Array<BinanceCandleStickInterface>
): number => {
  const closePrices = candleSticks.map((candle) => candle.prices.close);
  let sumOfClosePrices = 0;
  for (const price of closePrices) {
    sumOfClosePrices = sumOfClosePrices + +price;
  }
  const numberOfCandleSticks = closePrices.length;
  const ma = sumOfClosePrices / numberOfCandleSticks;
  return ma;
};
