import { SymbolInterface } from "../../Interfaces/cryptos";

interface ConfigDownloadHistoryInterface {
  symbols: SymbolInterface;
  interval: string;
  year: number;
}


export const configDownloadHistory: Array<ConfigDownloadHistoryInterface> = [{
  symbols: { base: "BTC", vs: "USDT" },
  interval: "1m",
  year: 2019
},{
  symbols: { base: "BTC", vs: "USDT" },
  interval: "1m",
  year: 2018
},{
  symbols: { base: "ETH", vs: "USDT" },
  interval: "1m",
  year: 2019
},{
  symbols: { base: "ETH", vs: "USDT" },
  interval: "1m",
  year: 2018
},];
