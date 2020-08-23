import { Symbol } from "../../../Interfaces/cryptos";
import { publicRequest } from "..";

export interface Intervals {
  number: number;
  timeUnit: "s" | "m" | "h" | "d";
}
export const getLastPrice = async (p: { symbols: Symbol }): Promise<number> => {
  const result = await publicRequest({
    data: { symbol: `${p.symbols.base}${p.symbols.vs}` },
    endPoint: "/ticker/price",
    type: "GET",
  });
  return result.price as number;
};
export const getCandleSticks = async (p: {
  symbols: Symbol;
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
