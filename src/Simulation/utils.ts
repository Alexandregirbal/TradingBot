import moment from "moment";
import { colorSuccess } from "../Console";
import { SimulationInterface, SimulationOrder } from "../Interfaces/simulation";
const fs = require("fs");

export const saveSimulationAsJSON = (p: {
  simulationParameters: SimulationInterface;
  startTime: number;
  endTime: number;
  globalVariation: number;
  orders: Array<SimulationOrder>;
  fileName: string;
  version: number;
  increment: string;
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
      startTime: moment(p.startTime).format("LLL"),
      endTime: moment(p.endTime).format("LLL"),
      globalVariation,
      numberOfOrders: p.orders.length,
      orders: p.orders,
    },
    null,
    4
  );
  fs.writeFile(
    `./history/simulations/${p.fileName}-${p.version}.json`,
    json,
    "utf8",
    () => {
      fs.appendFile("./src/Simulation/config.ts", p.increment, function (
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
