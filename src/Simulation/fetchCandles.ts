import { BinanceCandleStickInterface } from "../Interfaces/binance";
import { SymbolInterface } from "../Interfaces/cryptos";
import parseToCandleStick from "../Services/Parsers/candlesticks";
const fs = require("fs");

export const fetchOneMonth = (p: {
  symbols: SymbolInterface;
  month: number;
  year: number;
}): Array<BinanceCandleStickInterface> => {
  try{
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
  } catch (e){
    return [];
  }
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

export const fetchAllFromSymbols = (p: {
  symbols: SymbolInterface;
}): Array<BinanceCandleStickInterface> => {
  let result: any[] = [];
  for (let i = 0; i < 3; i++) {
    result = [...result, ...fetchOneYear({ ...p, year: (2018+i) })];
  }
  return result;
};

export const fetchAllByMonthVsUSDT = (): Array<BinanceCandleStickInterface> => {
  const listOfCurrencies = ["BTC", "ETH"];
  let result: any[] = [];
  for (let i = 0; i < listOfCurrencies.length; i++) {
    const symbols : SymbolInterface = {base: listOfCurrencies[i], vs: "USDT"};
    for (let j = 0; j < 3; j++) {
      result = [...result, ...fetchOneYear({ symbols, year: (2018+j) })];
    }
  }
  return result;
};
