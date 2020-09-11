import { SymbolInterface } from "../../../Interfaces/cryptos";
import { publicRequest } from "..";
import {
  BinanceIntervalsEnum,
  BinanceCandleStickInterface,
} from "../../../Interfaces/binance";
import moment from "moment";
import { colorSuccess } from "../../../Console";
const fs = require("fs");

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

const numberOfIntervals = (p: {
  interval: BinanceIntervalsEnum;
  deltaTime: number;
}) => {};

export const getCandleSticks45445 = async (p: {
  symbols: SymbolInterface;
  interval: BinanceIntervalsEnum;
  startTime: number;
  endTime: number;
}): Promise<Array<BinanceCandleStickInterface>> => {
  let tmpTime = {
    start: p.startTime,
    end: p.endTime,
  };
  let timeSlices: Array<{ start: number; end: number }> = [];
  const numberOfIntervalsMax = 1000;
  while (tmpTime.end - tmpTime.start >= numberOfIntervalsMax) {
    tmpTime.start = tmpTime.start + numberOfIntervalsMax;
  }

  let result: Array<BinanceCandleStickInterface> = [];
  for (const slice of timeSlices) {
    const tmpResult = await publicRequest({
      data: {
        symbol: `${p.symbols.base}${p.symbols.vs}`,
        interval: `${p.interval}`,
        startTime: slice.start,
        endTime: slice.end,
      },
      endPoint: "/klines",
      type: "GET",
    });
    result = [...result, ...tmpResult];
  }
  return result;
};
export const getCandleSticks = async (p: {
  symbols: SymbolInterface;
  interval: string;
  startTime: number;
  endTime: number;
  limit: number; //<1000 / will be deleted
}): Promise<Array<Array<number>>> => {
  const result = await publicRequest({
    data: {
      symbol: `${p.symbols.base}${p.symbols.vs}`,
      interval: `${p.interval}`,
      startTime: p.startTime,
      endTime: p.endTime,
      limit: p.limit,
    },
    endPoint: "/klines",
    type: "GET",
  });
  return result;
};

export const getOneMonthCandleSticks = async (p: {
  symbols: SymbolInterface;
  interval: string;
  monthNumber: number;
  year: number;
}) => {
  let result: any[] = [];
  let startTime = moment().year(p.year).month(p.monthNumber).startOf("month");
  let endTime = moment()
    .year(p.year)
    .month(p.monthNumber)
    .startOf("month")
    .add(1000, "minutes");
  if (p.interval === "1m") {
    for (let i = 0; i < 44; i++) {
      const resOne = await getCandleSticks({
        symbols: p.symbols,
        interval: p.interval,
        startTime: startTime.valueOf(),
        endTime: endTime.valueOf(),
        limit: 1000,
      });
      result = [...result, ...resOne];
      startTime.add(1000, "minutes");
      endTime.add(1000, "minutes");
    }
  }
  console.log("Number of candle sticks : ", result.length);
  const json = JSON.stringify(
    {
      candles: result,
    },
    null,
    4
  );
  fs.writeFile(
    `./history/candles/monthes/${p.symbols.base}-${p.symbols.vs}_${p.year}-${
      p.monthNumber + 1
    }.json`,
    json,
    "utf8",
    () => {
      console.log(colorSuccess(`Candles of a month saved`));
    }
  );
  return result;
};

export const getOneYearCandleSticks = async (p: {
  symbols: SymbolInterface;
  interval: string;
  year: number;
}) => {
  for (let i = 0; i < 12; i++) {
    getOneMonthCandleSticks({ ...p, monthNumber: i });
  }
};
