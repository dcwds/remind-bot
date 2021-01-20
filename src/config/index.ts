import dotenv from "dotenv"
import { Client } from "discord.js"
import remindHandler from "../cmd-handlers/remind/remind"
import { CommandDictionary } from "../types"

dotenv.config()

export default {
  discord: new Client(),
  discordBotToken: process.env.DISCORD_BOT_TOKEN as string,
  remindersPath: `${process.cwd()}/src/data/reminders.json`,
  remindChannelId: process.env.DISCORD_REMIND_CHANNEL_ID as string,
  cmdPrefix: "!",
  cmdDict: {
    remind: {
      aliases: ["remind", "r"],
      handler: remindHandler
    }
  } as CommandDictionary
}
