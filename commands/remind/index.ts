import dayjs from "dayjs";
import { ApplicationCommandOptionData, CommandInteraction } from "discord.js";
import { Command } from "../../interfaces/command";

const options: ApplicationCommandOptionData[] = [
  {
    type: "NUMBER",
    name: "hour",
    description: "何時に通知するか",
  },
  {
    type: "NUMBER",
    name: "minute",
    description: "何分に通知するか",
  },
  {
    type: "STRING",
    name: "message",
    description: "何を通知するか",
  },
];

const validateHour = (hour: number | null): hour is number => {
  if (!hour) return false;
  return hour > 0 && hour < 24;
};

const validateMinute = (minute: number | null): minute is number => {
  if (!minute) return false;
  return minute > 0 && minute < 60;
};

const process: Command["process"] = (interaction: CommandInteraction) => {
  const hour = interaction.options.getNumber("hour");
  const minute = interaction.options.getNumber("minute");
  const message = interaction.options.getString("message");

  if (!validateHour(hour) || !validateMinute(minute) || message === null) {
    interaction.reply(`コマンドに渡す値が異常です。
    [hour]: 0～24までの値を入力してください。
    [minute]: 0～60までの値を入力してください。
    [message]: 文字列を入力してください。`);
    return;
  }

  const now = dayjs();
  const settedDate = now.hour(hour).minute(minute).second(0);
  const remindDate = settedDate.isAfter(now)
    ? settedDate
    : settedDate.add(1, "day");

  const mentionMessage = `<@!${interaction.member?.user.id}> ${message}`;
  remindPromise(interaction, remindDate.diff(now), mentionMessage);
  interaction.reply(
    `リマインドを設定しました。${remindDate.format(
      "HH時mm分"
    )}に${message}と通知します。`
  );
};

const remindPromise = async (
  interaction: CommandInteraction,
  msec: number,
  message: string
) => {
  console.log(msec);
  await new Promise((resolve) => setTimeout(resolve, msec));
  interaction.channel?.send(message);
};

export const remind: Command = {
  name: "remind",
  description: "reminder",
  process: process,
  options: options,
};
