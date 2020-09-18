import { SymbolInterface } from "../../Interfaces/cryptos";

interface ConfigDownloadHistoryInterface {
  symbols: SymbolInterface;
  interval: string;
  year: number;
}

export const configDownloadHistory: Array<ConfigDownloadHistoryInterface> = [
  {
    symbols: { base: "BTC", vs: "USDT" },
    interval: "1m",
    year: 2020,
  },
];
