import { SymbolInterface } from "../../../Interfaces/cryptos";
import { publicRequest } from "..";
import { Intervals } from "../../../Interfaces/binance";

export const getLastPrice = async (p: {
  symbols: SymbolInterface;
}): Promise<number> => {
  const result = await publicRequest({
    data: { symbol: `${p.symbols.base}${p.symbols.vs}` },
    endPoint: "/ticker/price",
    type: "GET",
  });
  return result.price as number;
};
export const getCandleSticks = async (p: {
  symbols: SymbolInterface;
  interval: Intervals;
  startTime: number;
  endTime: number;
  limit?: number; //<1000
}): Promise<Array<Array<number>>> => {
  const result = await publicRequest({
    data: {
      symbol: `${p.symbols.base}${p.symbols.vs}`,
      interval: `${p.interval.number}${p.interval.timeUnit}`,
      startTime: p.startTime,
      endTime: p.endTime,
      limit: p.limit,
    },
    endPoint: "/klines",
    type: "GET",
  });
  return result;
};
