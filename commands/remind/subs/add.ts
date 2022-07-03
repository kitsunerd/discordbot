import dayjs, { Dayjs } from "dayjs";
import {
  ApplicationCommandOptionData,
  CommandInteraction,
  TextBasedChannel,
} from "discord.js";
import { addReminds, removeReminds } from "..";
import { Command, SubCommand } from "../../../interfaces/command";
import { v4 as uuidv4 } from "uuid";

const option: ApplicationCommandOptionData = {
  type: "SUB_COMMAND",
  name: "add",
  description: "リマインドの追加",
  options: [
    {
      type: "NUMBER",
      name: "hour",
      description: "何時に通知するか",
      required: true,
    },
    {
      type: "NUMBER",
      name: "minute",
      description: "何分に通知するか",
      required: true,
    },
    {
      type: "STRING",
      name: "message",
      description: "何を通知するか",
      required: true,
    },
  ],
};

const process: Command["process"] = (interaction: CommandInteraction) => {
  const member = interaction.member;
  const channel = interaction.channel;
  if (!member || !channel) {
    interaction.reply("不明なエラーが発生しました。");
    return;
  }

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

  startReminder(channel, {
    userId: member.user.id,
    now: now,
    remindDate: remindDate,
    message: message,
  });

  interaction.reply(
    `リマインドを設定しました。${remindDate.format(
      "HH時mm分"
    )}に${message}と通知します。`
  );
};

const validateHour = (hour: number | null): hour is number => {
  if (hour === null) return false;
  return hour > 0 && hour < 24;
};

const validateMinute = (minute: number | null): minute is number => {
  if (minute === null) return false;
  return minute >= 0 && minute < 60;
};

type InputRemindData = {
  userId: string;
  remindId?: string;
  message: string;
  now: Dayjs;
  remindDate: Dayjs;
};

export const startReminder = (
  sendChannel: TextBasedChannel,
  input: InputRemindData
) => {
  return new Promise<string>((resolve, reject) => {
    const remindId = input.remindId || uuidv4();
    // リマインド一覧に保存
    const added = {
      userId: input.userId,
      remindId: remindId,
      channelId: sendChannel.id,
      message: input.message,
      remindDate: input.remindDate.format("YYYY-MM-DD HH:mm"),
      rejectFn: reject,
    };
    addReminds(input.userId, added, { persistence: !input.remindId });

    const msec = input.remindDate.diff(input.now);
    setTimeout(() => {
      resolve(remindId);
    }, msec);
  })
    .then((remindId) => {
      console.log(
        "remind!",
        `remindId: ${remindId}`,
        `channel: ${sendChannel?.id}`,
        `input: ${{ ...input }}`
      );
      sendChannel.send(`<@!${input.userId}> ${input.message}`);
      removeReminds(input.userId, remindId);
    })
    .catch();
};

export const add: SubCommand = {
  option: option,
  process: process,
};
