export const taapiClient = require("taapi").client(TAAPI.api);
import { SymbolInterface } from "../../Interfaces/cryptos";
import { TAAPI } from "../../config";
export const getRSI = async (params: {
  symbols: SymbolInterface;
  intervals: string;
}) => {
  return await taapiClient.getIndicator(
    "rsi",
    "binance",
    `${params.symbols.base}/${params.symbols.vs}`,
    params.intervals
  );
};
