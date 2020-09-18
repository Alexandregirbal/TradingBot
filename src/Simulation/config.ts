import moment from "moment";
import { BinanceIntervalsEnum } from "../Interfaces/binance";
import { SymbolInterface } from "../Interfaces/cryptos";
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
const interval = BinanceIntervalsEnum.m1;

export const increment = "config.version++;"; // this line will be added for each new simulation run

interface ConfigSimulationInterface {
  name: string;
  version: number;
  start: { year: number; month: number };
  end: { year: number; month: number };
  symbols: any;
  interval: string;
  strategy: any;
  transactionFee: number;
}

export const config: ConfigSimulationInterface = {
  name: "simulation",
  version: 1,
  symbols: { base: "BTC", vs: "USDT" },
  start: { year: 2020, month: 9 },
  end: { year: 2020, month: 9 },
  interval,
  strategy: {
    entry: {
      rsi: "<=30",
    },
    exit: {
      rsi: ">=69",
    },
  },
  transactionFee: 0.1 / 100, //0.1% max chez Binance
};
config.version++;