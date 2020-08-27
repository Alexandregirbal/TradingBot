import { SymbolInterface } from "./cryptos";
import { Intervals } from "./binance";

/**
 * @type T: the object representing indicators and rules about them
 */
export interface StrategyInterface<T> {
  entry: T;
  exit: T;
}
export interface SimulationInterface {
  symbols: SymbolInterface;
  interval: Intervals;
  startTime: number;
  endTime: number;
  strategy: StrategyInterface<any>;
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
