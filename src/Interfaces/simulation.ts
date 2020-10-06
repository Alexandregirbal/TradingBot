import { SymbolInterface } from "./cryptos";

/**
 * @type T: the object representing indicators and rules about them
 */
export interface StrategyInterface<T> {
  entryStrategy: T;
  exitStrategy: T;
}
export interface SimulationInterface {
  symbols: SymbolInterface;
  start?: { year: number; month: number };
  end?: { year: number; month: number };
  interval: string;
  strategy: StrategyInterface<any>;
  transactionFee: number;
  version: number;
  fileName: string;
  autoIncrement: boolean;
}
export interface SimulationOrder {
  buy: {
    price: number;
    quantity: number;
    time: string;
    indicators: any;
  };
  sell: {
    price: number;
    quantity: number;
    time: string;
    indicators: any;
  };
  variation: number;
}

export interface IndicatorsInterface {
  rsi: number;
}
export interface StopInterface {
  takeProfit: number;
  stopLoss: number;
}
interface YearAndMonth {
  year: number;
  month: number;
}

export interface ConfigSimulationInterface {
  name: string;
  version: number;
  start: YearAndMonth;
  end: YearAndMonth;
  symbols: SymbolInterface;
  interval: string;
  strategy: {
    entryStrategy: IndicatorsInterface;
    exitStrategy: StopInterface & IndicatorsInterface;
  };
  transactionFee: number;
}
export interface IterableConfigSimulationInterface {
  name: string;
  version: number;
  times: Array<{
    start: YearAndMonth;
    end: YearAndMonth;
  }>;
  symbols: Array<SymbolInterface>;
  intervals: Array<string>;
  strategies: {
    entryStrategies: Array<IndicatorsInterface>;
    exitStrategies: Array<StopInterface & IndicatorsInterface>;
  };
  transactionFee: number;
}
