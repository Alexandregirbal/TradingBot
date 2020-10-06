export interface SymbolInterface {
  base: string;
  vs: string;
}
export interface CandleStickInterface {
  prices: {
    open: number;
    close: number;
    high: number;
    low: number;
  };
  time: {
    open: number;
    close: number;
  };
  volumes: {
    base: number;
    quote: number;
  };
  numberOfTrades: number;
  // refer to binance api documentation for more
}
