import moment from "moment";

const startTime = moment().startOf("week").valueOf();
const endTime = moment().startOf("week").add(960, "minutes").valueOf();

const params = {
  name: "simulation",
  version: 0,
  startTime,
  endTime,
};
export default params;
// this line will be added for each new test run : 'params.version++;'
params.version++;params.version++;