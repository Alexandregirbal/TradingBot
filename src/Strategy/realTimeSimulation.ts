import ping from "../Services/Public/Ping";
import { isObjectEmpty } from "../utils/objects";
import { colorToBlue, colorToRed } from "../Console";
import { getLastPrice, getCandleSticks } from "../Services/Public/Symbol";
import { getRSI } from "../Services/Indicators/taapi";
import moment from "moment";
import { calculateRSI } from "../Services/Indicators/custom";
const fs = require("fs");
//TODO some things here
const delay = 1000 * 60; // 1 minute
const intervals = "1m";
const positionParameters = {
  entry: 20,
  exit: 60,
};
const symbols = { base: "BTC", vs: "USDT" };
let orders: Array<any> = [];
const initialOrder: any = {
  symbol: "",
  buy: -1,
  buyTime: -1,
  quantity: -1,
  sell: -1,
  sellTime: -1,
  winloss: -1,
};
let actualOrder = { ...initialOrder };
let price: number = -1;
let percentage = -1;
let rsi = -1;
console.log(
  "\n\n\n--------------------------RUNNING SIMULATION--------------------------"
);
ping()
  .then(async (res) => {
    if (isObjectEmpty(res.data)) {
      console.log(colorToBlue("Binance API available"));
      //TEST AREA
      //saveOrdersAsJSON(orders);

      //END OF TEST AREA
    }
    rsi = await calculateRSI({
      numberOfPeriodes: 13,
      intervals: { number: 1, timeUnit: "m" },
      symbols,
      startTime: moment().startOf("week").subtract(14, "minutes").valueOf(),
      endTime: moment().startOf("week").valueOf(),
    });
    setInterval(async () => {
      rsi = await calculateRSI({
        numberOfPeriodes: 13,
        intervals: { number: 1, timeUnit: "m" },
        symbols,
        startTime: moment().startOf("week").subtract(14, "minutes").valueOf(),
        endTime: moment().startOf("week").valueOf(),
      });
      console.log(`ALEX: calc rsi`, rsi);
      price = await getLastPrice({ symbols });
      percentage = +((price - actualOrder.buy) / actualOrder.buy).toFixed(2);
      if (actualOrder.buy === -1) {
        //on attend une entrée
        if (rsi <= positionParameters.entry) {
          //BUY
          actualOrder.symbol = `${symbols.base}${symbols.vs}`;
          actualOrder.buy = price;
          actualOrder.buyTime = moment().format("MMMM Do YYYY, h:mm:ss a");
          console.log("BUY:", actualOrder);
        }
      } else {
        //on attend une sortie
        if (rsi >= positionParameters.exit || percentage >= 0.3) {
          console.log(`ALEX: percentage & rsi`, percentage, rsi);
          //SELL
          actualOrder.sell = price;
          actualOrder.sellTime = moment().format("MMMM Do YYYY, h:mm:ss a");
          actualOrder.winloss = percentage;
          orders.push(actualOrder);
          saveOrdersAsJSON(orders);
          console.log("SELL:", actualOrder);
          actualOrder = { ...initialOrder };
        }
      }
    }, delay);
  })
  .catch((err) =>
    console.log(
      colorToRed(
        "Binance API unreachable, check internet connexion or Binance website."
      )
    )
  );

const saveOrdersAsJSON = (orders: Array<any>) => {
  const json = JSON.stringify({
    iteration: 2,
    positionParameters,
    symbols,
    intervals,
    order: orders,
  });
  fs.writeFile("./history/result-4.json", json, "utf8", () =>
    console.log("File saved")
  );
};
// setInterval(() => {
//   minutes++;
//   let price = -1;
//   let percentage = +((price - actualOrder.buy) / actualOrder.buy).toFixed(2);
//   getRSI({
//     baseAsset: "BTC",
//     quoteAsset: "USDT",
//     intervals: "1m",
//   })
//     .then((res) => {
//       console.log(`RSI:`, res);
//       if (actualOrder.buy === -1) {
//         //on attend une entrée
//         if (res.value <= 30) {
//           //BUY
//           actualOrder.symbol = "BTCUSDT";
//           actualOrder.buy = price;
//           console.log("BUY:", actualOrder);
//         }
//       } else {
//         //on attend une sortie
//         if (res.value >= 60 || percentage >= 0.2) {
//           //SELL
//           actualOrder.sell = price;
//           actualOrder.winloss = percentage;
//           orders.push(actualOrder);
//           console.log("SELL:", actualOrder);
//           actualOrder = { ...initialOrder };
//         }
//       }
//     })
//     .catch((err) => console.error(err));
//   if (minutes % 60 === 0) {
//     console.log(orders);
//   }
// }, 60000);
// placeLimitOrder({
//   type: "BUY",
//   cryptos: {
//     base: "BTC",
//     vs: "USDT",
//   },
//   price: 11500,
//   quantity: 0.002,
// });
// binanceClient.prevDay(
//   "BTCUSDT",
//   (error: any, prevDay: { priceChangePercent: string }, symbol: string) => {
//     console.log(symbol + " previous day:", prevDay);
//   }
// );
// binanceClient.candlesticks(
//   "BNBBTC",
//   "5m",
//   (error: any, ticks: string | any[], symbol: string) => {
//     console.info("candlesticks()", ticks);
//     let last_tick = ticks[ticks.length - 1];
//     let [
//       time,
//       open,
//       high,
//       low,
//       close,
//       volume,
//       closeTime,
//       assetVolume,
//       trades,
//       buyBaseVolume,
//       buyAssetVolume,
//       ignored,
//     ] = last_tick;
//   },
//   { limit: 500, endTime: 1514764800000 }
// );
