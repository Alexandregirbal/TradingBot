import { BinanceIntervalsEnum } from "../Interfaces/binance";
import { IterableConfigSimulationInterface } from "../Interfaces/simulation";
import { config } from "./config";
import { launchSimulation } from "./launchSimulation";
const { name: historyFileName, version } = config;

const testConfig: IterableConfigSimulationInterface = {
  name: "simulation",
  version: 1,
  symbols: [{ base: "BTC", vs: "USDT" }],
  times: [
    {
      start: { year: 2018, month: 1 },
      end: { year: 2018, month: 6 },
    },
    {
      start: { year: 2018, month: 7 },
      end: { year: 2018, month: 12 },
    },
    {
      start: { year: 2019, month: 1 },
      end: { year: 2019, month: 6 },
    },
    {
      start: { year: 2019, month: 7 },
      end: { year: 2019, month: 12 },
    },
    {
      start: { year: 2020, month: 1 },
      end: { year: 2020, month: 6 },
    },
  ],
  intervals: [BinanceIntervalsEnum.m1],
  strategies: {
    entryStrategies: [
      {
        rsi: 30,
      },
    ],
    exitStrategies: [
      {
        takeProfit: 1.005,
        stopLoss: 0.999,
        rsi: 70,
      },
    ],
  },
  transactionFee: 0.1 / 100, //0.1% max chez Binance
};
export const launchManySimulations = async (
  simulationConfig: IterableConfigSimulationInterface
) => {
  let i = 1;
  for (const symbol of simulationConfig.symbols) {
    for (const interval of simulationConfig.intervals) {
      for (const entryStrategy of simulationConfig.strategies.entryStrategies) {
        for (const exitStrategy of simulationConfig.strategies.exitStrategies) {
          for (const time of simulationConfig.times) {
            await launchSimulation({
              interval: interval,
              symbols: symbol,
              start: time.start,
              end: time.end,
              strategy: {
                entryStrategy,
                exitStrategy,
              },
              transactionFee: simulationConfig.transactionFee,
              version: i,
              fileName: `${historyFileName}${-version}`,
              autoIncrement: false,
            });
            i++;
          }
        }
      }
    }
  }
};
export default async () => launchManySimulations(testConfig);
