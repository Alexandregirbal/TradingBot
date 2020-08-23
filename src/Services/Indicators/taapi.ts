import { taapiClient } from "../../index";
import { Symbol } from "../../Interfaces/cryptos";
export const getRSI = async (params: {
  symbols: Symbol;
  intervals: string;
}) => {
  return await taapiClient.getIndicator(
    "rsi",
    "binance",
    `${params.symbols.base}/${params.symbols.vs}`,
    params.intervals
  );
};
