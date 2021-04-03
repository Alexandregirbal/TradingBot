import moment from "moment";
import { BinanceIntervalsEnum } from "../Interfaces/binance";
import { ConfigSimulationInterface } from "../Interfaces/simulation";

export const increment = "config.version++;"; // this line will be added for each new simulation run

export const config: ConfigSimulationInterface = {
  name: "simulation",
  version: 1,
  symbols: { base: "BTC", vs: "USDT" },
  start: { year: 2020, month: 1 },
  end: { year: 2020, month: 6 },
  interval: BinanceIntervalsEnum.m1,
  strategy: {
    entryStrategy: {
      rsi: 30,
    },
    exitStrategy: {
      takeProfit: 1.01,
      stopLoss: 0.995,
      rsi: 68,
    },
  },
  wallet: 10000,
  transactionFee: 1 - 0.075 / 100, //0.1% max chez Binance
};
config.version++;
config.version++;
config.version++;
config.version++;config.version++;