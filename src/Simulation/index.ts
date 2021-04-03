import moment from "moment";
import { colorToBlue, colorToRed, highlightToBlue } from "../Console";
import launchManySimulations from "./launchManySimulations";
import launchSimulation from "./launchSimulation";
moment.locale("fr");

console.log(
  "\n\n\n" +
    highlightToBlue(
      "--------------------------RUNNING BACKTEST--------------------------"
    )
);
launchSimulation().catch((err) =>
  console.error(colorToRed(`Error: ${err}\n`), err)
);
// launchManySimulations().catch((err) =>
//   console.error(colorToRed(`Error: ${err}\n`), err)
// );
