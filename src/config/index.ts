import dotenv from "dotenv"

dotenv.config()

const config = {
  discordBotToken: process.env.DISCORD_BOT_TOKEN as string,
  remindersPath: `${process.cwd()}/src/data/reminders.json`,
  remindChannelId: process.env.DISCORD_REMIND_CHANNEL_ID as string
}

export default config
