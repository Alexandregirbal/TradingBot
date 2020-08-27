import { privateRequest } from "..";
import { SymbolInterface } from "../../../Interfaces/cryptos";
import { Order, Balance } from "../../../Interfaces/orders";
import { getAccountInformation } from "../Account";
import GetExchangeInfo from "../../Public/ExchangeInfo";
export const getOpenOrders = async (p: { symbols: SymbolInterface }) => {
  return await privateRequest({
    data: {
      symbol: `${p.symbols.base}${p.symbols.vs}`,
    },
    endPoint: "/openOrders",
    type: "GET",
  });
};

export const buy = async (p: {
  symbols: SymbolInterface;
  quantity: number;
  price: number;
}) => {
  const balance = (await getAccountInformation()).balances.filter(
    (balance: Balance) => balance.asset === p.symbols.vs
  )[0];
  if (balance.free >= p.price * p.quantity) {
    return await placeLimitOrder({ side: "BUY", ...p });
  } else {
    return "We need more money man...";
  }
};
export const sell = async (p: {
  symbols: SymbolInterface;
  quantity: number;
  price: number;
}) => {
  const balance = (await getAccountInformation()).balances.filter(
    (balance: Balance) => balance.asset === p.symbols.base
  )[0];
  if (balance.free >= p.quantity) {
    return await placeLimitOrder({ side: "SELL", ...p });
  } else {
    return "We don't have that much bro...";
  }
};

const placeLimitOrder = async (p: {
  side: "SELL" | "BUY";
  symbols: SymbolInterface;
  quantity: number;
  price: number;
}) => {
  const data: Order = {
    side: p.side,
    type: "LIMIT",
    symbol: `${p.symbols.base}${p.symbols.vs}`,
    price: p.price,
    quantity: p.quantity,
    timeInForce: "GTC",
  };
  // const lotSize = (await GetExchangeInfo()).data.symbols
  //   .filter((s: any) => s.symbol === data.symbol)[0]
  //   .filters.filter((filter: any) => filter.filterType === "LOT_SIZE")[0];
  // console.log(`ALEX: lotSize`, lotSize);

  console.log(
    `[${data.side}] ${p.symbols.base} for ${data.price * data.quantity}${
      p.symbols.vs
    }`
  );
  return await privateRequest({
    data,
    endPoint: "/order",
    type: "POST",
  });
};

const placeMarketOrder = () => {
  return true;
};
