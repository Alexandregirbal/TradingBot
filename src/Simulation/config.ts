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

interface IndicatorsInterface {
  rsi: number;
}
interface StopInterface {
  takeProfit: number;
  stopLoss: number;
}
interface ConfigSimulationInterface {
  name: string;
  version: number;
  start: { year: number; month: number };
  end: { year: number; month: number };
  symbols: any;
  interval: string;
  strategy: {
    entryStrategy: IndicatorsInterface;
    exitStrategy: StopInterface & IndicatorsInterface;
  };
  transactionFee: number;
}

export const config: ConfigSimulationInterface = {
  name: "simulation",
  version: 1,
  symbols: { base: "ETH", vs: "USDT" },
  start: { year: 2018, month: 1 },
  end: { year: 2018, month: 6 },
  interval,
  strategy: {
    entryStrategy: {
      rsi: 30,
    },
    exitStrategy: {
      takeProfit: 1.005,
      stopLoss: 0.999,
      rsi: 69,
    },
  },
  transactionFee: 0.1 / 100, //0.1% max chez Binance
};
config.version++;
config.version++;
config.version++;
config.version++;
config.version++;
config.version++;
config.version++;
config.version++;
config.version++;
config.version++;
config.version++;
config.version++;
config.version++;
config.version++;
