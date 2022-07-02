import { RemindData } from "../../interfaces/reminder";
import fs from "fs";
import { initialize } from "./initialize";

export const insertReminderRepository = {
  insert(remindData: RemindData) {
    initialize();
    const json = JSON.parse(fs.readFileSync(`${__dirname}/data.json`, "utf-8"));
    const arr: RemindData[] = json.remind;
    if (arr.some((remind) => remind.remindId === remindData.remindId)) return;
    const strArr = JSON.stringify({ remind: [...arr, remindData] }, null, " ");
    fs.writeFileSync(`${__dirname}/data.json`, strArr);
  },
};
