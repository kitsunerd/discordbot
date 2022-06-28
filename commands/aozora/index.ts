import { CommandInteraction } from "discord.js";
import { Command } from "../../interfaces/command";

const process: Command["process"] = (interaction: CommandInteraction) => {
  interaction.reply("fuck");
};

export const aozora: Command = {
  name: "aozora",
  description: "call aozora",
  process: process,
};
