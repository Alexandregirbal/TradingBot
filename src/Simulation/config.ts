import moment from "moment";
import { BinanceIntervalsEnum } from "../Interfaces/binance";
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

export const increment = "config.version++;"; // this line will be added for each new test run

interface ConfigSimulationInterface {
  name: string;
  version: number;
  startTime: number;
  endTime: number;
  symbols: any;
  interval: string;
  strategy: any;
}
const config: ConfigSimulationInterface = {
  name: "simulation",
  version: 1,
  startTime,
  endTime,
  symbols: { base: "BTC", vs: "USDT" },
  interval,
  strategy: {
    entry: {
      rsi: "<=30",
    },
    exit: {
      rsi: ">=69",
    },
  },
};
export default config;
config.version++;config.version++;config.version++;config.version++;config.version++;