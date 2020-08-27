import { SymbolInterface } from "../../Interfaces/cryptos";
import { getCandleSticks } from "../Public/Symbol";
import { Intervals } from "../../Interfaces/binance";
export const calculateRSI = async (p: {
  numberOfPeriodes: number;
  symbols: SymbolInterface;
  intervals: Intervals;
  startTime: number;
  endTime: number;
}): Promise<number> => {
  const closePrices = (
    await getCandleSticks({
      symbols: p.symbols,
      interval: p.intervals,
      startTime: p.startTime,
      endTime: p.endTime,
      limit: 1000,
    })
  ).map((candle) => +candle[4]);
  let upwards = [];
  let downwards = [];
  for (let i = 1; i < closePrices.length; i++) {
    const delta = closePrices[i] - closePrices[i - 1];
    upwards.push(delta > 0 ? delta : 0);
    downwards.push(delta < 0 ? -delta : 0);
  }
  const avgU = upwards.reduce((a, c) => a + c) / p.numberOfPeriodes;
  const avgD = downwards.reduce((a, c) => a + c) / p.numberOfPeriodes;

  const rs = avgU / avgD;
  const rsi = +(100 - 100 / (1 + rs)).toFixed(2);
  return rsi;
};

export const calculateRSIFromCandleSticks = (
  candleSticks: Array<any>
): number => {
  const closePrices = candleSticks.map((candle) => +candle[4]);
  let upwards = [];
  let downwards = [];
  const numberOfCandleSticks = closePrices.length;
  for (let i = 1; i < numberOfCandleSticks; i++) {
    const delta = closePrices[i] - closePrices[i - 1];
    upwards.push(delta > 0 ? delta : 0);
    downwards.push(delta < 0 ? -delta : 0);
  }
  const avgU = upwards.reduce((a, c) => a + c) / numberOfCandleSticks;
  const avgD = downwards.reduce((a, c) => a + c) / numberOfCandleSticks;

  const rs = avgU / avgD;
  const rsi = +(100 - 100 / (1 + rs)).toFixed(2);
  return rsi;
};
