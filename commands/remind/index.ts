import dayjs from "dayjs";
import { ChannelManager, CommandInteraction } from "discord.js";
import { Command } from "../../interfaces/command";
import { RemindData } from "../../interfaces/reminder";
import { deleteReminderRepository } from "../../repository/Reminder/delete";
import { insertReminderRepository } from "../../repository/Reminder/insert";
import * as subcommands from "./subs";
import { startReminder } from "./subs/add";

export type Remind = {
  remindId: string;
  channelId: string;
  userId: string;
  message: string;
  // YYYY-MM-DD
  remindDate: string;
  rejectFn: (reason?: any) => void;
};

const reminds: Record<string, Remind[]> = {};

const process: Command["process"] = (interaction: CommandInteraction) => {
  if (!Object.keys(subcommands).includes(interaction.options.getSubcommand()))
    return;
  // @ts-ignore
  subcommands[interaction.options.getSubcommand()].process(interaction);
};

export const remind: Command = {
  name: "remind",
  description: "reminder",
  process: process,
  options: Object.values(subcommands).map((command) => command.option),
};

export const getReminds = (userId: string) => reminds[userId] || [];

type AddOptions = {
  persistence: boolean;
};
export const addReminds = (
  userId: string,
  added: Remind,
  options: AddOptions
) => {
  const current = getReminds(userId);
  reminds[userId] = [...current, added];
  if (!options.persistence) return;
  // 永続化
  insertReminderRepository.insert({
    userId: userId,
    channelId: added.channelId,
    remindId: added.remindId,
    message: added.message,
    remindDate: added.remindDate,
  });
};

export const removeReminds = (userId: string, remindId: string) => {
  const current = getReminds(userId);
  reminds[userId] = current.filter((remind) => remind.remindId !== remindId);
  deleteReminderRepository.deleteById(remindId);
};

export const importReminder = (
  remindData: RemindData[],
  channelManager: ChannelManager
) => {
  const now = dayjs();
  for (const data of remindData) {
    channelManager.fetch(data.channelId).then((channel) => {
      if (channel?.type !== "GUILD_TEXT") return;
      startReminder(channel, {
        userId: data.userId,
        remindId: data.remindId,
        message: data.message,
        now: now,
        remindDate: dayjs(data.remindDate),
      });
    });
  }
};
