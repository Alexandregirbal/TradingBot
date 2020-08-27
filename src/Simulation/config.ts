import moment from "moment";
import { Intervals } from "../Interfaces/binance";
const substractor = {
  periodes: 8,
  unity: "days",
};
const startTime = moment()
  .subtract(substractor.periodes, substractor.unity as any)
  .valueOf();
const endTime = moment()
  .subtract(substractor.periodes, substractor.unity as any)
  .add(960, "minutes")
  .valueOf();

export const increment = "config.version++;"; // this line will be added for each new test run
interface ConfigSimulationInterface {
  name: string;
  version: number;
  startTime: number;
  endTime: number;
  interval: Intervals;
}
const config: ConfigSimulationInterface = {
  name: "simulation",
  version: 1,
  startTime,
  endTime,
  interval: { number: 1, timeUnit: "m" },
};
export default config;
