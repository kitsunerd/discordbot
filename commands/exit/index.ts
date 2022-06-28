import { CommandInteraction } from "discord.js";
import { Command } from "../../interfaces/command";

const process: Command["process"] = (interaction: CommandInteraction) => {
  interaction.reply("bye");
  interaction.client.destroy();
};

export const exit: Command = {
  name: "exit",
  description: "exit bot",
  process: process,
};
