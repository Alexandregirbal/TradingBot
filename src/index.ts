import { BINANCE, TAAPI } from "./config";
import getServerTime from "./Services/Public/GetServerTime";
import moment from "moment";
import { getBalances } from "./Services/Private/Balance";
import { getOpenOrders, buy, sell } from "./Services/Private/Orders";
import GetExchangeInfo from "./Services/Public/ExchangeInfo";
import { getRSI } from "./Services/Indicators/taapi";
import { getAccountInformation, getTrades } from "./Services/Private/Account";
const taapi = require("taapi");

export const taapiClient = taapi.client(TAAPI.api);
// buy({
//   symbols: {
//     base: "BTC",
//     vs: "USDT",
//   },
//   price: 10000,
//   quantity: 0.001,
// });
// sell({
//   symbols: {
//     base: "LTC",
//     vs: "USDT",
//   },
//   price: 62,
//   quantity: 0.3697,
// });
