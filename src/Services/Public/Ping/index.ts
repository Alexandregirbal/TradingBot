import axios, { AxiosResponse } from "axios";
import { BINANCE } from "../../../config";

export default async (): Promise<AxiosResponse<any>> => {
  const res = await axios({
    method: "get",
    url: `${BINANCE.url}/ping`,
  });
  return res;
};
