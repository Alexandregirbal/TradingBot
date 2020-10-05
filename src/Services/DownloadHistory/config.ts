import { SymbolInterface } from "../../Interfaces/cryptos";

interface ConfigDownloadHistoryInterface {
  symbols: SymbolInterface;
  interval: string;
  year: number;
}

export const configDownloadHistory: Array<ConfigDownloadHistoryInterface> = [
  {
    symbols: { base: "ETH", vs: "USDT" },
    interval: "1m",
    year: 2017,
  },
];
