import fs from "fs";

export const initialize = () => {
  if (fs.existsSync(`${__dirname}/data.json`)) return;
  const str = JSON.stringify({ remind: [] }, null, " ");
  fs.writeFileSync(`${__dirname}/data.json`, str);
};
