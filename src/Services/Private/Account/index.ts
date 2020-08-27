import { privateRequest } from "..";
import { SymbolInterface } from "../../../Interfaces/cryptos";

export const getAccountInformation = async () => {
  return await privateRequest({
    data: {},
    endPoint: "/account",
    type: "GET",
  });
};
/**
 *
 * @param p symbols to get history of
 * @example getTrades({symbols:{ base:'BTC', vs: 'USDT' } })
 */
export const getTrades = async (p: { symbols: SymbolInterface }) => {
  return await privateRequest({
    data: { symbol: `${p.symbols.base}${p.symbols.vs}` },
    endPoint: "/myTrades",
    type: "GET",
  });
};
