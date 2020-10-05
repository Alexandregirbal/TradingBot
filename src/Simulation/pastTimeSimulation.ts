import moment from "moment";
import { BinanceCandleStickInterface } from "../Interfaces/binance";
import { SimulationInterface, SimulationOrder } from "../Interfaces/simulation";
import { calculateMovingAverage } from "../Services/Indicators/custom/movingAverage";
import { calculateRSIFromCandleSticks } from "../Services/Indicators/custom/rsi";
import { shouldBuy, shouldSell } from "./buyAndSellStrategy";
import { config, increment } from "./config";
import { fetchPeriode } from "./fetchCandles";
import { saveSimulationAsJSON } from "./utils";
moment.locale("fr");
const { name: historyFileName, version, strategy } = config;

/**
 * Does the simulation and writes a json file
 * @returns the global variation as a multiplicator of the inital wallet after simulation
 */
export const lauchSimulation = async ({
  symbols,
  start,
  end,
  interval,
  strategy,
  transactionFee,
}: SimulationInterface): Promise<number> => {
  let globalVariation = 1;
  let orders: Array<SimulationOrder> = [];
  let hasBought = false;
  let actualOrder: SimulationOrder = {
    buy: {
      price: -1,
      quantity: 1,
      time: "",
      indicators: {},
    },
    sell: {
      price: -1,
      quantity: 1,
      time: "",
      indicators: {},
    },
    variation: 1,
  };
  let closingPrice: number = -1;
  let rsi = { previous: -1, actual: -1 };
  let ma = {
    first: { previous: -1, actual: -1 },
    second: { previous: -1, actual: -1 },
  };
  const rsiPeriodes = 14;
  const movingAveragePeriodes = { first: 21, second: 7 };
  let candleSticks: Array<BinanceCandleStickInterface> = [];
  candleSticks = fetchPeriode({
    symbols,
    start: start as any, //can be undefined becauce of the interface, could be modified
    end: end as any,
  });
  const startTime = candleSticks[0].time.open;
  const endTime = candleSticks[candleSticks.length - 1].time.close;
  console.log("Number of Candles : ", candleSticks.length);
  console.log("Number of months studied : ", candleSticks.length / 43000);

  for (let i = rsiPeriodes; i < candleSticks.length; i++) {
    const actualCandle = candleSticks[i];
    rsi.previous = rsi.actual;
    rsi.actual = calculateRSIFromCandleSticks(
      candleSticks.slice(i - rsiPeriodes, i)
    );
    ma.first.previous = ma.first.actual;
    ma.first.actual = calculateMovingAverage(
      candleSticks.slice(i - movingAveragePeriodes.first, i)
    );
    ma.second.previous = ma.second.actual;
    ma.second.actual = calculateMovingAverage(
      candleSticks.slice(i - movingAveragePeriodes.second, i)
    );

    // i % 100 === 0 &&
    //   console.log(
    //     `\nMA(movingAveragePeriodes) ${moment(actualCandle.time.close).format("LLL")}:`,
    //     ma
    //   );
    closingPrice = actualCandle.prices.close;
    if (!hasBought) {
      //on attend une entrée
      //if (eval(`${rsi}${strategy.entry.rsi}`)) {
      if (
        shouldBuy({
          rsi: {
            strategy: strategy.entryStrategy.rsi,
            ...rsi,
          },
          ma,
        })
      ) {
        //BUY
        hasBought = true;
        actualOrder.buy.price = closingPrice;
        actualOrder.buy.time = moment(actualCandle.time.close).format(
          "MMMM Do YYYY, h:mm:ss a"
        );
        actualOrder.buy.indicators = { rsi };
      }
    } else {
      //hasBought === true
      //on attend une sortie
      actualOrder.variation = +(
        (closingPrice * (1 - transactionFee)) /
        (actualOrder.buy.price * (1 - transactionFee))
      ).toFixed(8); // no need of transaction fees while no quantities are settled
      // if (eval(`${rsi}${strategy.exit.rsi}`)) {
      if (
        shouldSell({
          rsi: { strategy: strategy.exitStrategy.rsi, ...rsi },
          ma,
          variation: {
            actual: actualOrder.variation,
            ...strategy.exitStrategy,
          },
        })
      ) {
        //SELL
        hasBought = false;
        actualOrder.sell.price = closingPrice;
        actualOrder.sell.time = moment(actualCandle.time.close).format(
          "MMMM Do YYYY, h:mm:ss a"
        );
        actualOrder.sell.indicators = { rsi };
        //Calculate variation of a transaction with fee
        orders.push(actualOrder);
        actualOrder = {
          buy: {
            price: -1,
            quantity: 1,
            time: "",
            indicators: {},
          },
          sell: {
            price: -1,
            quantity: 1,
            time: "",
            indicators: {},
          },
          variation: 1,
        };
      }
    }
  }
  const variations = orders.map((order) => order.variation);
  globalVariation = +variations
    .reduce((acc, variation) => {
      return acc * variation;
    }, 1)
    .toFixed(6);
  saveSimulationAsJSON({
    simulationParameters: {
      symbols,
      interval,
      strategy,
      transactionFee,
    },
    startTime: moment(startTime).valueOf(),
    endTime: moment(endTime).valueOf(),
    globalVariation,
    orders,
    fileName: historyFileName,
    version,
    increment,
  });
  return globalVariation;
};
