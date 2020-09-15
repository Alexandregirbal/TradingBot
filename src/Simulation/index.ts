import moment from "moment";
import { colorToBlue, colorToRed, highlightToBlue } from "../Console";
import ping from "../Services/Public/Ping";
import { isObjectEmpty } from "../utils/objects";
import { config } from "./config";
import { lauchSimulation } from "./pastTimeSimulation";
moment.locale("fr");
const fs = require("fs");
const {
  name: historyFileName,
  version,
  symbols,
  start,
  end,
  interval,
  strategy,
} = config;

console.log(
  "\n\n\n" +
    highlightToBlue(
      "--------------------------RUNNING BACKTEST--------------------------"
    ) +
    colorToBlue(
      `\nThe simulation will be saved as ${historyFileName}-${version}.json`
    )
);
const resultOfSimulation = lauchSimulation({
  symbols,
  start,
  end,
  interval,
  strategy,
})
  .then((res) => {
    console.log(`ALEX: resultOfSimulation`, res);
  })
  .catch((err) => console.error(colorToRed(`Error: ${err}\n`), err));
