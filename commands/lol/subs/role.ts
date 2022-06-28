import { ApplicationCommandOptionData } from "discord.js";
import { SubCommand } from "../../../interfaces/command";

const option: ApplicationCommandOptionData = {
  type: "SUB_COMMAND",
  name: "role",
  description: "LoLのroleが決まらないときに使ってください",
  options: [
    {
      type: "STRING",
      name: "roles",
      description: `カンマ区切りでロールを指定できます。しない場合はすべてのロールから選ばれます。
    ex) top,mid,adc`,
    },
  ],
};

const DEFAULT_ROLES = ["top", "jungle", "mid", "adc", "support"];

const process: SubCommand["process"] = (interaction) => {
  const inputRolesStr = interaction.options.getString("roles");
  const inputRoles = inputRolesStr?.split(",");

  const roles = inputRoles ? inputRoles : DEFAULT_ROLES;
  const randNum = Math.floor(Math.random() * roles.length);
  interaction.reply(`roleは${roles[randNum]}です！`);
};

export const role: SubCommand = {
  option: option,
  process: process,
};
