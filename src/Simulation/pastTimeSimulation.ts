import moment from "moment";
import { colorSuccess } from "../Console";
import { SimulationInterface, SimulationOrder } from "../Interfaces/simulation";
import { calculateRSIFromCandleSticks } from "../Services/Indicators/custom/rsi";
import { config, increment } from "./config";
import {
  fetchAllByMonthVsUSDT,
  fetchAllFromSymbols,
  fetchOneMonth,
  fetchOneYear,
  fetchPeriode,
} from "./fetchCandles";
import { BinanceCandleStickInterface } from "../Interfaces/binance";
import { calculateMovingAverage } from "../Services/Indicators/custom/movingAverage";
moment.locale("fr");
const fs = require("fs");
const { name: historyFileName, version } = config;

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
  let rsi = -1;
  let ma = -1;
  const rsiPeriodes = 14;
  const movingAveragePeriodes = 7;
  let candleSticks: Array<BinanceCandleStickInterface> = [];
  // candleSticks = fetchOneMonth({ symbols, year: 2018, month: 3 });
  //candleSticks = await fetchOneYear({ symbols, year: 2018 });
  //candleSticks = await fetchAllByMonthVsUSDT();
  //candleSticks = await fetchAllFromSymbols({symbols});
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
    rsi = calculateRSIFromCandleSticks(candleSticks.slice(i - rsiPeriodes, i));
    ma = calculateMovingAverage(
      candleSticks.slice(i - movingAveragePeriodes, i)
    );
    // i % 100 === 0 &&
    //   console.log(
    //     `\nMA(movingAveragePeriodes) ${moment(actualCandle.time.close).format("LLL")}:`,
    //     ma
    //   );
    closingPrice = actualCandle.prices.close;
    if (!hasBought) {
      //on attend une entrée
      if (eval(`${rsi}${strategy.entry.rsi}`)) {
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
      if (eval(`${rsi}${strategy.exit.rsi}`)) {
        //SELL
        hasBought = false;
        actualOrder.sell.price = closingPrice;
        actualOrder.sell.time = moment(actualCandle.time.close).format(
          "MMMM Do YYYY, h:mm:ss a"
        );
        actualOrder.sell.indicators = { rsi };
        //Calculate variation of a transaction with fees
        actualOrder.variation = +(
          (actualOrder.sell.price * (1 - transactionFee)) /
          (actualOrder.buy.price * (1 - transactionFee))
        ).toFixed(8); // no need of transaction fees while no quantities are settled
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
    .reduce((acc, variation, index) => {
      return index !== 0 ? acc * variation : 1 * variation;
    })
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
    writeNew: true,
  });
  return globalVariation;
};

const prettySimulation = (
  simulation: SimulationInterface,
  startTime: number,
  endTime: number
) => {
  return {
    ...simulation,
    startTime: moment(startTime).format("LLL"),
    endTime: moment(endTime).format("LLL"),
  };
};
const saveSimulationAsJSON = (p: {
  simulationParameters: SimulationInterface;
  startTime: number;
  endTime: number;
  globalVariation: number;
  orders: Array<SimulationOrder>;
  writeNew: boolean;
}) => {
  let globalVariation = {
    multiplicator: p.globalVariation,
    percentage: `${
      p.globalVariation > 1
        ? ((p.globalVariation - 1) * 100).toFixed(2)
        : "-" + ((1 - p.globalVariation) * 100).toFixed(2)
    }%`,
  };

  const json = JSON.stringify(
    {
      ...prettySimulation(p.simulationParameters, p.startTime, p.endTime),
      globalVariation,
      numberOfOrders: p.orders.length,
      orders: p.orders,
    },
    null,
    4
  );
  fs.writeFile(
    `./history/simulations/${historyFileName}-${version}.json`,
    json,
    "utf8",
    () => {
      p.writeNew &&
        fs.appendFile("./src/Simulation/config.ts", increment, function (
          err: any
        ) {
          if (err) return console.error(err);
        });
      console.log(
        colorSuccess(
          `Simulation saved, variation: ${globalVariation.percentage}`
        )
      );
    }
  );
};
