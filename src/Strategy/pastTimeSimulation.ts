import moment from "moment";
import { colorToBlue, colorToRed, highlightToBlue } from "../Console";
import {
  calculateRSI,
  calculateRSIFromCandleSticks,
} from "../Services/Indicators/custom";
import ping from "../Services/Public/Ping";
import { getCandleSticks, getLastPrice } from "../Services/Public/Symbol";
import { isObjectEmpty } from "../utils/objects";
import parameters from "./params";
moment.locale("fr");
const fs = require("fs");

const { name: historyFileName, version, startTime, endTime } = parameters;
const prettyStartTime = moment(startTime).format("LLL");
const prettyEndTime = moment(endTime).format("LLL");

//TODO some things here
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
let closingPrice: number = -1;
let percentage = -1;
let rsi = -1;

const saveOrdersAsJSON = (orders: Array<any>) => {
  const json = JSON.stringify({
    positionParameters,
    symbols,
    intervals,
    order: orders,
  });
  fs.writeFile(
    `./history/${historyFileName}-${version}.json`,
    json,
    "utf8",
    () =>
      fs.appendFile("./src/Strategy/params.ts", "params.version++;", function (
        err: any
      ) {
        if (err) return console.error(err);
        console.log("Simulation saved");
      })
  );
};

console.log(
  "\n\n\n" +
    highlightToBlue(
      "--------------------------RUNNING BACKTEST--------------------------"
    ) +
    `\n${prettyStartTime} --> ${prettyEndTime}` +
    `\n${historyFileName}-${version}`
);
ping()
  .then(async (res) => {
    if (isObjectEmpty(res.data)) {
      console.log(colorToBlue("Binance API available"));
      //TEST AREA

      const candleSticks = await getCandleSticks({
        symbols,
        limit: 960,
        interval: { number: 1, timeUnit: "m" },
        startTime,
        endTime,
      });
      console.log(`ALEX: candleSticks`, candleSticks.length);
      //END OF TEST AREA

      for (let i = 0; i < candleSticks.length; i++) {
        rsi = calculateRSIFromCandleSticks(candleSticks);
        i % 10 === 0 && console.log(`\nRSI ${i}:`, rsi);
        const actualCandle = candleSticks[i];
        closingPrice = actualCandle[4];

        //    setInterval(async () => {
        percentage = +(
          (closingPrice - actualOrder.buy) /
          actualOrder.buy
        ).toFixed(2);
        if (actualOrder.buy === -1) {
          //on attend une entrée
          if (rsi <= positionParameters.entry) {
            //BUY
            actualOrder.symbol = `${symbols.base}${symbols.vs}`;
            actualOrder.buy = closingPrice;
            actualOrder.buyTime = moment().format("MMMM Do YYYY, h:mm:ss a");
            console.log("BUY:", actualOrder);
          }
        } else {
          //on attend une sortie
          if (rsi >= positionParameters.exit || percentage >= 0.3) {
            console.log(`ALEX: percentage & rsi`, percentage, rsi);
            //SELL
            actualOrder.sell = closingPrice;
            actualOrder.sellTime = moment().format("MMMM Do YYYY, h:mm:ss a");
            actualOrder.winloss = percentage;
            orders.push(actualOrder);
            console.log("SELL:", actualOrder);
            actualOrder = { ...initialOrder };
          }
        }
      }
      saveOrdersAsJSON(orders);
    }
  })
  .catch((err) =>
    console.log(
      colorToRed(
        "Binance API unreachable, check internet connexion or Binance website."
      )
    )
  );
