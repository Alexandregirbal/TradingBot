const crypto = require("crypto");
export const buildSign = (data: any, secretApiKey: string | undefined) => {
  return crypto.createHmac("sha256", secretApiKey).update(data).digest("hex");
};
