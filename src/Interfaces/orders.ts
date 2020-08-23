/**
 * Orders are limited to 10 orders per second
 */
export interface Order {
  //https://github.com/binance-exchange/binance-official-api-docs/blob/master/rest-api.md
  symbol: string; //LTCBTC,
  side: "BUY" | "SELL";
  type:
    | "LIMIT"
    | "MARKET"
    | "STOP_LOSS"
    | "STOP_LOSS_LIMIT"
    | "TAKE_PROFIT"
    | "TAKE_PROFIT_LIMIT"
    | "LIMIT_MAKER";
  timeInForce: "GTC" | "IOC" | "FOK"; //Good Til Canceled | Immediate Or Cancel | Fill or Kill
  quantity: number; //1,
  price: number; //0.1,
}

export interface Balance {
  asset: string;
  free: number;
  locked: number;
}
