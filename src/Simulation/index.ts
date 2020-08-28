import moment from "moment";
import { colorToBlue, colorToRed, highlightToBlue } from "../Console";
import ping from "../Services/Public/Ping";
import { isObjectEmpty } from "../utils/objects";
import config from "./config";
import { lauchSimulation } from "./pastTimeSimulation";
moment.locale("fr");
const fs = require("fs");
const {
  name: historyFileName,
  version,
  startTime,
  endTime,
  symbols,
  interval,
  strategy,
} = config;
const prettyStartTime = moment(startTime).format("LLL");
const prettyEndTime = moment(endTime).format("LLL");

console.log(
  "\n\n\n" +
    highlightToBlue(
      "--------------------------RUNNING BACKTEST--------------------------"
    ) +
    `\n${prettyStartTime} --> ${prettyEndTime}` +
    `\n${historyFileName}-${version}`
);
ping()
  .then(async (res) => {
    if (isObjectEmpty(res.data)) {
      console.log(colorToBlue("Binance API available"));
      const resultOfSimulation = await lauchSimulation({
        symbols,
        interval,
        startTime,
        endTime,
        strategy,
      });

      console.log(`ALEX: resultOfSimulation`, resultOfSimulation);
    }
  })
  .catch((err) =>
    console.log(
      colorToRed(
        "Binance API unreachable, check internet connexion or Binance website."
      )
    )
  );
