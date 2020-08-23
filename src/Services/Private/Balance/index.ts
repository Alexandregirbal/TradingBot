import axios, { AxiosResponse } from "axios";
import { BINANCE } from "../../../config";

export const getBalances = async () => {
  const res = await axios({
    method: "get",
    headers: {
      "X-MBX-APIKEY": BINANCE.api,
    },
    url: `${BINANCE.url}/account`,
  });
  return res;
};
