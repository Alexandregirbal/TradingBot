import { privateRequest } from "..";
import { Symbol } from "../../../Interfaces/cryptos";

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
export const getTrades = async (p: { symbols: Symbol }) => {
  return await privateRequest({
    data: { symbol: `${p.symbols.base}${p.symbols.vs}` },
    endPoint: "/myTrades",
    type: "GET",
  });
};
