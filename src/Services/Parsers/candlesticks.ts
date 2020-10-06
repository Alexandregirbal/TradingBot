import { CandleStickInterface } from "../../Interfaces/cryptos";

export default (candle: Array<number>): CandleStickInterface => {
  return {
    prices: {
      open: candle[1],
      close: candle[4],
      high: candle[2],
      low: candle[3],
    },
    time: {
      open: candle[0],
      close: candle[6],
    },
    volumes: {
      base: candle[5],
      quote: candle[7],
    },
    numberOfTrades: candle[8],
  };
};
