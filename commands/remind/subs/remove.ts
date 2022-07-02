import { ApplicationCommandOptionData, CommandInteraction } from "discord.js";
import { getReminds, removeReminds } from "..";
import { Command, SubCommand } from "../../../interfaces/command";

const option: ApplicationCommandOptionData = {
  type: "SUB_COMMAND",
  name: "remove",
  description: "リマインドの削除",
  options: [
    {
      type: "NUMBER",
      name: "index",
      description: "どのリマインドを削除するか",
      required: true,
    },
  ],
};

const process: Command["process"] = (interaction: CommandInteraction) => {
  const member = interaction.member;
  if (!member) {
    interaction.reply("不明なエラーが発生しました。[member is undefined]");
    return;
  }
  const reminds = getReminds(member.user.id);

  const index = interaction.options.getNumber("index");
  if (!validateIndex(index, reminds.length)) {
    interaction.reply("削除に失敗しました。異常なリマインド番号です！");
    return;
  }

  const removedRemind = reminds[index - 1];
  removedRemind.rejectFn();
  removeReminds(member.user.id, removedRemind.remindId);

  interaction.reply(`リマインドを削除しました。`);
};

const validateIndex = (
  index: number | null,
  remindLength: number
): index is number => {
  if (index === null) return false;
  if (index === 0) return false;
  return index > 0 && index < remindLength + 1;
};

// deleteが予約後で使えなかったのでremoveにした（わかりやすさで言ったらdeleteかなと思ったが）
export const remove: SubCommand = {
  option: option,
  process: process,
};
