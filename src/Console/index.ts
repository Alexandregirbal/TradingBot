import { RequestType } from "../Interfaces/http";
const color = require("cli-color");

export const colorRequestType = (type: RequestType["type"]) => {
  switch (type) {
    case "GET":
      return color.blue("[GET]");
    case "POST":
      return color.cyan("[POST]");
    case "PUT":
      return color.yellow("[PUT]").yellow;
    case "DELETE":
      return color.red("[DELETE]").red;
  }
};

export const colorStatusCode = (code: string | number) => {
  switch (code) {
    case 429 || "429":
      return color.red.bold(`[${code.toString()}]`);
    case 400 || "400":
      return color.red(`[${code.toString()}]`);
    default:
      return color.bold(`[${code.toString()}]`);
  }
};

export const colorToBlue = (s: string) => {
  return color.blue(s);
};
export const colorToRed = (s: string) => {
  return color.red(s);
};

export const highlightToBlue = (s: string) => {
  return color.white.bgBlue(s);
};
