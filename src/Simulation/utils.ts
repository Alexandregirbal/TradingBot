import moment from "moment";
import { colorFaillure, colorSuccess } from "../Console";
import { SimulationInterface, SimulationOrder } from "../Interfaces/simulation";
import { prettyUnixDate } from "../Services/Parsers/dates";
const fs = require("fs");

export const saveSimulationAsJSON = async (p: {
  simulationParameters: SimulationInterface;
  startTime: number;
  endTime: number;
  wallet: { begin: number; end: number };
  globalVariation: number;
  orders: Array<SimulationOrder>;
  increment: string | undefined;
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
      ...p.simulationParameters,
      startTime: prettyUnixDate(p.startTime),
      endTime: prettyUnixDate(p.endTime),
      wallet: p.wallet,
      globalVariation,
      numberOfOrders: p.orders.length,
      orders: p.orders,
    },
    null,
    4
  );
  await fs.writeFile(
    `./history/simulations/${p.simulationParameters.fileName}-${p.simulationParameters.version}.json`,
    json,
    "utf8",
    () => {
      p.simulationParameters.autoIncrement &&
        fs.appendFile("./src/Simulation/config.ts", p.increment, function (
          err: any
        ) {
          if (err) return console.error(err);
        });
      const colorRevealVariation =
        globalVariation.multiplicator >= 1 ? colorSuccess : colorFaillure;
      console.log(
        "Simulation saved, variation:",
        colorRevealVariation(`${globalVariation.percentage}`),
        `(${p.orders.length} orders)`
      );
    }
  );
};
