import moment from "moment";
import { colorSuccess } from "../Console";
import { SimulationInterface, SimulationOrder } from "../Interfaces/simulation";
import { calculateRSIFromCandleSticks } from "../Services/Indicators/custom";
import {
  getCandleSticks,
  getOneMonthCandleSticks,
  getOneYearCandleSticks,
} from "../Services/Public/Symbol";
import {config, increment } from "./config";
import { fetchAllByMonthVsUSDT, fetchAllFromSymbols, fetchOneMonth, fetchOneYear } from "./fetchCandles";
import { BinanceCandleStickInterface } from "../Interfaces/binance";
moment.locale("fr");
const fs = require("fs");
const { name: historyFileName, version } = config;

/**
 * Does the simulation and writes a json file
 * @returns the result as a multiplicator of the inital wallet after simulation
 */
export const lauchSimulation = async ({
  symbols,
  interval,
  startTime,
  endTime,
  strategy,
}: SimulationInterface): Promise<number> => {
  let result = 1;
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
    variation: -1,
  };
  let closingPrice: number = -1;
  let rsi = -1;
  const rsiPeriodes = 14;
  let candleSticks : Array<BinanceCandleStickInterface> = [];
  candleSticks = await fetchOneMonth({ symbols, year: 2018, month: 3 });
  //candleSticks = await fetchOneYear({ symbols, year: 2018 });
  //candleSticks = await fetchAllByMonthVsUSDT();
  //candleSticks = await fetchAllFromSymbols({symbols});
  console.log("Number of Candles : ", candleSticks.length);
  console.log("Number of months studied : ", candleSticks.length /43000);
  for (let i = rsiPeriodes; i < candleSticks.length; i++) {
    rsi = calculateRSIFromCandleSticks(candleSticks.slice(i - rsiPeriodes, i));
    //i % 100 === 0 && console.log(`\nRSI ${i}:`, rsi);
    const actualCandle = candleSticks[i];
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
        actualOrder.variation = +(
          ((closingPrice - actualOrder.buy.price) / actualOrder.buy.price) *
          100
        ).toFixed(2);
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
          variation: -1,
        };
      }
    }
  }
  const variations = orders.map((order) => order.variation);
  for (const variation of variations) {
    result = +(result * (1 + variation / 100)).toFixed(4);
  }
  saveSimulationAsJSON({
    simulationParameters: {
      symbols,
      interval,
      startTime,
      endTime,
      strategy,
    },
    result,
    orders,
    writeNew: true,
  });
  return result;
};

const prettySimulation = (simulation: SimulationInterface) => {
  return {
    ...simulation,
    startTime: moment(simulation.startTime).format("LLL"),
    endTime: moment(simulation.endTime).format("LLL"),
  };
};
const saveSimulationAsJSON = (p: {
  simulationParameters: SimulationInterface;
  result: number;
  orders: Array<SimulationOrder>;
  writeNew: boolean;
}) => {
  let result = { multiplicator: p.result, percentage: "0%" };

  result.percentage = `${
    result.multiplicator > 1
      ? ((result.multiplicator - 1) * 100).toFixed(2)
      : "-" + ((1 - result.multiplicator) * 100).toFixed(2)
  }%`;
  const json = JSON.stringify(
    {
      ...prettySimulation(p.simulationParameters),
      result,
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
        colorSuccess(`Simulation saved, variation: ${result.percentage}`)
      );
    }
  );
};
