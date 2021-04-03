import moment from "moment";
moment.locale("fr");

export const preciseAndPrettyUnixDate = (unixTimeStamp: number): string => {
  return moment(unixTimeStamp).format("LLLL");
};
export const prettyUnixDate = (unixTimeStamp: number): string => {
  return moment(unixTimeStamp).format("LL");
};
