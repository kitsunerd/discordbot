import { ApplicationCommandOptionData } from "discord.js";
import { getReminds, Remind } from "..";
import { SubCommand } from "../../../interfaces/command";
import dayjs from "dayjs";

const option: ApplicationCommandOptionData = {
  type: "SUB_COMMAND",
  name: "list",
  description: "リマインドの一覧を表示します",
};

const process: SubCommand["process"] = (interaction) => {
  const member = interaction.member;
  if (!member) {
    interaction.reply("不明なエラーが発生しました。[member is undefined]");
    return;
  }

  const reminds = getReminds(member.user.id);
  const message = formatMessage(member.user.id, reminds);

  interaction.reply(message);
};

const formatMessage = (userId: string, reminds: Remind[]) => {
  if (reminds.length === 0) return "リマインド中のメッセージはありません。";
  return `<@!${userId}> のリマインド一覧はコチラです。
      ===========================
      [リマインド番号] : [通知時間] : [メッセージ]
      ${reminds.map(
        (remind, index) =>
          `[${index + 1}] : [${dayjs(remind.remindDate).format(
            `MM月DD日 HH時mm分`
          )}] : [${remind.message}]`
      )}
      `;
};

export const list: SubCommand = {
  option: option,
  process: process,
};
