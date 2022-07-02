import { RemindData } from "../../interfaces/reminder";
import fs from "fs";
import { initialize } from "./initialize";

export const deleteReminderRepository = {
  deleteById(remindId: string) {
    initialize();
    const json = JSON.parse(fs.readFileSync(`${__dirname}/data.json`, "utf-8"));
    const arr: RemindData[] = json.remind;
    const deleted = arr.filter((value) => value.remindId !== remindId);
    const strArr = JSON.stringify({ remind: deleted }, null, " ");
    fs.writeFileSync(`${__dirname}/data.json`, strArr);
  },
};
