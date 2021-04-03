import { BinanceIntervalsEnum } from "../../Interfaces/binance";
import { SymbolInterface } from "../../Interfaces/cryptos";

interface ConfigDownloadHistoryInterface {
  symbols: SymbolInterface;
  interval: string;
  year: number;
}

export const configDownloadHistory: Array<ConfigDownloadHistoryInterface> = [
  {
    symbols: { base: "ETH", vs: "USDT" },
    interval: BinanceIntervalsEnum.m1,
    year: 2017,
  },
];
