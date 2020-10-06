import moment from "moment";
import { BinanceIntervalsEnum } from "../Interfaces/binance";
import { ConfigSimulationInterface } from "../Interfaces/simulation";

const substractor = {
  periodes: 8,
  unity: "days",
};
const startTime = moment()
  .subtract(substractor.periodes, substractor.unity as any)
  .valueOf();
const endTime = moment()
  .subtract(substractor.periodes, substractor.unity as any)
  .add(960, "minutes")
  .valueOf();

export const increment = "config.version++;"; // this line will be added for each new simulation run

export const config: ConfigSimulationInterface = {
  name: "simulation",
  version: 1,
  symbols: { base: "BTC", vs: "USDT" },
  start: { year: 2018, month: 1 },
  end: { year: 2018, month: 6 },
  interval: BinanceIntervalsEnum.m1,
  strategy: {
    entryStrategy: {
      rsi: 28,
    },
    exitStrategy: {
      takeProfit: 1.005,
      stopLoss: 0.999,
      rsi: 68,
    },
  },
  transactionFee: 0.1 / 100, //0.1% max chez Binance
};
config.version++;config.version++;config.version++;config.version++;config.version++;config.version++;config.version++;config.version++;config.version++;config.version++;config.version++;config.version++;config.version++;config.version++;config.version++;config.version++;config.version++;config.version++;config.version++;config.version++;config.version++;config.version++;config.version++;config.version++;config.version++;config.version++;config.version++;config.version++;config.version++;config.version++;config.version++;