import axios, { AxiosRequestConfig } from "axios";
import { colorStatusCode } from "../Console";
const delay = 5 * 60 * 1000; // 5 minutes
let canSendRequest = true; // to prevent ban from any service as binance
export const sendRequest = async (
  requestConfig: AxiosRequestConfig
): Promise<any> => {
  const response = await axios(requestConfig);
  console.log(`${colorStatusCode(response.status)}`);
  if (response.status === 429) {
    console.log("You sent to many requests, wait 5 minutes to recover");
    canSendRequest = false;
    setTimeout(() => {
      canSendRequest = true;
    }, delay);
  }
  return response;
};
