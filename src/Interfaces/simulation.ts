import { SymbolInterface } from "./cryptos";
import { BinanceIntervalsEnum } from "./binance";

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
