import { BinanceCandleStickInterface } from "../Interfaces/binance";
import { SymbolInterface } from "../Interfaces/cryptos";
import parseToCandleStick from "../Services/Parsers/candlesticks";
const fs = require("fs");

export const fetchOneMonth = (p: {
  symbols: SymbolInterface;
  month: number;
  year: number;
}): Array<BinanceCandleStickInterface> => {
  const file = fs.readFileSync(
    `./history/candles/monthes/${p.symbols.base}-${p.symbols.vs}_${p.year}-${p.month}.json`,
    "utf8"
  );
  const candles = JSON.parse(file).candles;
  let result = [];
  for (const candle of candles) {
    result.push(parseToCandleStick(candle));
  }
  return result;
};

export const fetchOneYear = (p: {
  symbols: SymbolInterface;
  year: number;
}): Array<BinanceCandleStickInterface> => {
  let result: any[] = [];
  for (let i = 1; i < 13; i++) {
    result = [...result, ...fetchOneMonth({ ...p, month: i })];
  }
  return result;
};
