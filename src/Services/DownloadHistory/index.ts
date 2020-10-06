import moment from "moment";
import { colorToBlue, colorToRed, highlightToBlue } from "../../Console";
import { isObjectEmpty } from "../../utils/objects";
import ping from "../Public/Ping";
import { getOneYearCandleSticks } from "../Public/Symbol";
import { configDownloadHistory } from "./config";

moment.locale("fr");
const fs = require("fs");

console.log(
  "\n\n\n" +
    highlightToBlue(
      "--------------------------RUNNING DOWNLOAD HISTORY--------------------------"
    )
);
ping()
  .then(async (res) => {
    if (isObjectEmpty(res.data)) {
      console.log(colorToBlue("Binance API available"));
      for (let i = 0; i < configDownloadHistory.length; i++) {
        setTimeout(async () => {
          const { symbols, interval, year } = configDownloadHistory[i];
          const resultOfSimulation = await getOneYearCandleSticks({
            symbols,
            interval,
            year,
          });
        }, 60000 * i);
      }
    }
  })
  .catch((err) =>
    console.log(
      colorToRed(
        "Binance API unreachable, check internet connexion or Binance website."
      ),
      err
    )
  );
