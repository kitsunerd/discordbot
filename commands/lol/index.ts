import { Command } from "../../interfaces/command";
import * as subcommands from "./subs";

const process: Command["process"] = (interaction) => {
  if (!Object.keys(subcommands).includes(interaction.options.getSubcommand()))
    return;
  // @ts-ignore
  subcommands[interaction.options.getSubcommand()].process(interaction);
};

export const lol: Command = {
  name: "lol",
  description: "lolに関するコマンド",
  process: process,
  options: Object.values(subcommands).map((command) => command.option),
};
