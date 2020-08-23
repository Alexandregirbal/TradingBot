import { BINANCE } from "../../config";
import { stringify } from "querystring";
import moment from "moment";
import { RequestType } from "../../Interfaces/http";
import { colorRequestType, colorStatusCode } from "../../Console";
import { sendRequest } from "..";
import { buildSign } from "../../utils/security";

export const privateRequest = async (p: RequestType) => {
  p.data.timestamp = moment().valueOf();
  p.data.recvWindow = 4000;
  const dataQueryString = stringify(p.data);
  const signature = buildSign(dataQueryString, BINANCE.secret_api);
  const urlParams = `${BINANCE.url}${p.endPoint}`;
  const query = `${dataQueryString}&signature=${signature}`;
  const requestConfig = {
    method: p.type,
    url: `${urlParams}?${query}`,
    headers: { "X-MBX-APIKEY": `${BINANCE.api}` },
  };

  try {
    console.log(
      `\n${colorRequestType(requestConfig.method)} ${
        p.endPoint
      } with query: ${query}`
    );
    const response = await sendRequest(requestConfig);
    //console.log(response.data);
    return response.data;
  } catch (err) {
    console.error(`${colorStatusCode(err.response.status)}`, err.response.data);
    return err;
  }
};
