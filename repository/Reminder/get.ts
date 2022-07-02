import fs from "fs";
import { RemindData } from "../../interfaces/reminder";
import { initialize } from "./initialize";

export const fetchReminderRepository = {
  fetch(): RemindData[] {
    initialize();
    const json = JSON.parse(fs.readFileSync(`${__dirname}/data.json`, "utf-8"));
    return json.remind;
  },
};
