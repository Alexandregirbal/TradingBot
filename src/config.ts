require("dotenv").config();

export const NODE_ENV = process.env.NODE_ENV || "PROD";
export const BINANCE = {
  url: process.env.BINANCE_URL,
  api: process.env.BINANCE_API_KEY,
  secret_api: process.env.BINANCE_SECRET_API_KEY,
};
export const TAAPI = {
  api: process.env.TAAPI_API_KEY,
};
