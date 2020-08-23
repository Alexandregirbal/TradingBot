import { BINANCE } from "../../config";
import { stringify } from "querystring";
import { RequestType } from "../../Interfaces/http";
import { colorRequestType, colorStatusCode } from "../../Console";
import { sendRequest } from "..";

export const publicRequest = async (p: RequestType) => {
  const dataQueryString = stringify(p.data);
  const urlParams = `${BINANCE.url}${p.endPoint}`;
  const query = `${dataQueryString}`;
  const requestConfig = {
    method: p.type,
    url: `${urlParams}?${query}`,
  };
  try {
    console.log(
      `\n${colorRequestType(requestConfig.method)} ${
        p.endPoint
      } with query: ${query}`
    );
    const response = await sendRequest(requestConfig);
    return response.data;
  } catch (err) {
    console.error(`${colorStatusCode(err.response.status)}`, err.response.data);
    return err;
  }
};
