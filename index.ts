import dotenv from "dotenv";
import { Client, Intents, ApplicationCommandDataResolvable } from "discord.js";
import * as commands from "./commands";
import { fetchReminderRepository } from "./repository/Reminder/get";
import { importReminder } from "./commands/remind";

dotenv.config();

const client = new Client({
  intents: Object.values([
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_VOICE_STATES,
    Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
    Intents.FLAGS.DIRECT_MESSAGES,
  ]),
});

client.once("ready", async () => {
  const remindData = fetchReminderRepository.fetch();
  importReminder(remindData, client.channels);
  // await client.application?.commands.set([], "615540231159939092");
  const data: ApplicationCommandDataResolvable[] = Object.values(commands).map(
    (command) => ({
      name: command.name,
      description: command.description,
      options: command.options,
    })
  );
  await client.application?.commands.set(data, "615540231159939092");
});

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isCommand()) return;
  if (!Object.keys(interaction.commandName)) {
    interaction.reply("存在しないコマンドです");
    return;
  }
  // @ts-ignore
  // TODO: typeguardとかでなんとかならないか？
  commands[interaction.commandName].process(interaction);
});

client.login(process.env.DISCORD_TOKEN);
