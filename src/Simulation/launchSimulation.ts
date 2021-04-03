import { CandleStickInterface } from "../Interfaces/cryptos";
import { SimulationInterface, SimulationOrder } from "../Interfaces/simulation";
import { calculateMovingAverage } from "../Services/Indicators/custom/movingAverage";
import { calculateRSIFromCandleSticks } from "../Services/Indicators/custom/rsi";
import { preciseAndPrettyUnixDate } from "../Services/Parsers/dates";
import { shouldBuy, shouldSell } from "./buyAndSellStrategy";
import { config, increment } from "./config";
import { fetchPeriode } from "./fetchCandles";
import { saveSimulationAsJSON } from "./utils";

/**
 * Does the simulation and writes a json file
 * @returns the global variation as a multiplicator of the inital wallet after simulation
 */
export const launchSimulation = async ({
  symbols,
  start,
  end,
  interval,
  strategy,
  transactionFee,
  version,
  fileName,
  wallet,
  autoIncrement,
}: SimulationInterface): Promise<number> => {
  let globalVariation = 1;
  let orders: Array<SimulationOrder> = [];
  let currentWallet = wallet;
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
  const setActualOrderToInitial = (): void => {
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
  };
  let closingPrice: number = -1;
  let rsi = { previous: -1, actual: -1 };
  let ma = {
    first: { previous: -1, actual: -1 },
    second: { previous: -1, actual: -1 },
  };
  const rsiPeriodes = 14;
  const movingAveragePeriodes = { first: 21, second: 7 };
  let candleSticks: Array<CandleStickInterface> = [];
  candleSticks = fetchPeriode({
    symbols,
    start: start as any, //can be undefined becauce of the interface, could be modified
    end: end as any,
  });
  console.log("Number of Candles: ", candleSticks.length);

  const calculateIndicators = (index: number) => {
    rsi.previous = rsi.actual;
    rsi.actual = calculateRSIFromCandleSticks(
      candleSticks.slice(index - rsiPeriodes, index)
    );
    ma.first.previous = ma.first.actual;
    ma.first.actual = calculateMovingAverage(
      candleSticks.slice(index - movingAveragePeriodes.first, index)
    );
    ma.second.previous = ma.second.actual;
    ma.second.actual = calculateMovingAverage(
      candleSticks.slice(index - movingAveragePeriodes.second, index)
    );
    // index % 100 === 0 &&
    //   console.log(
    //     `\nMA(movingAveragePeriodes) ${moment(actualCandle.time.close).format("LLL")}:`,
    //     ma
    //   );
  };

  const buy = (actualCandle: CandleStickInterface) => {
    hasBought = true;
    actualOrder.buy.price = closingPrice;
    actualOrder.buy.quantity = (currentWallet * transactionFee) / closingPrice;
    currentWallet = currentWallet * transactionFee;
    actualOrder.buy.time = preciseAndPrettyUnixDate(actualCandle.time.close);
    actualOrder.buy.indicators = { rsi };
  };

  const sell = (actualCandle: CandleStickInterface) => {
    hasBought = false;
    actualOrder.sell.price = closingPrice;
    actualOrder.sell.quantity = actualOrder.buy.quantity * transactionFee;
    currentWallet = actualOrder.sell.quantity * closingPrice;
    actualOrder.sell.time = preciseAndPrettyUnixDate(actualCandle.time.close);
    actualOrder.sell.indicators = { rsi };
    orders.push(actualOrder);
    setActualOrderToInitial();
  };

  const calculateVariation = (closingPrice: number) => {
    return +(
      (closingPrice * actualOrder.buy.quantity * transactionFee) /
      (actualOrder.buy.quantity * actualOrder.buy.price)
    ).toFixed(6);
  };

  const saveSimulation = async () => {
    await saveSimulationAsJSON({
      simulationParameters: {
        symbols,
        interval,
        strategy,
        transactionFee,
        fileName: fileName,
        version,
        wallet,
        autoIncrement,
      },
      startTime: candleSticks[0].time.open,
      endTime: candleSticks[candleSticks.length - 1].time.close,
      wallet: { begin: wallet, end: +currentWallet.toFixed(2) },
      globalVariation,
      orders,
      increment,
    });
  };

  for (let index = rsiPeriodes; index < candleSticks.length; index++) {
    const actualCandle = candleSticks[index];
    calculateIndicators(index);
    closingPrice = actualCandle.prices.close;

    if (!hasBought) {
      if (
        shouldBuy({
          rsi: {
            strategy: strategy.entryStrategy.rsi,
            ...rsi,
          },
          ma,
        })
      ) {
        buy(actualCandle);
      }
    } else if (hasBought) {
      actualOrder.variation = calculateVariation(closingPrice);
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
        sell(actualCandle);
      }
    }
  }
  const variations = orders.map((order) => order.variation);
  globalVariation = +variations
    .reduce((acc, variation) => {
      return acc * variation;
    }, 1)
    .toFixed(6);
  console.log("variation-->", wallet, currentWallet, currentWallet / wallet);
  await saveSimulation();
  return globalVariation;
};

const {
  name: historyFileName,
  version,
  symbols,
  start,
  end,
  interval,
  strategy,
  transactionFee,
  wallet,
} = config;
export default async () =>
  await launchSimulation({
    symbols,
    start,
    end,
    interval,
    strategy,
    transactionFee,
    fileName: historyFileName,
    version: version,
    wallet,
    autoIncrement: true,
  });
