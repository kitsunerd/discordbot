import { CommandInteraction, ApplicationCommandOptionData } from "discord.js";

export interface Command {
  name: string;
  description: string;
  options?: ApplicationCommandOptionData[];
  process: (interaction: CommandInteraction) => unknown;
}

export interface SubCommand {
  option: ApplicationCommandOptionData;
  process: (interaction: CommandInteraction) => unknown;
}
