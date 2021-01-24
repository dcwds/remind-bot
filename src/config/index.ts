import { split } from "rambda"
import dotenv from "dotenv"

dotenv.config()

const config = {
  discordPowerRoleIds: split(
    " ",
    process.env.DISCORD_POWER_ROLE_IDS as string
  ) as string[],
  discordBotToken: process.env.DISCORD_BOT_TOKEN as string,
  remindersPath: `${process.cwd()}/src/data/reminders.json`,
  remindChannelId: process.env.DISCORD_REMIND_CHANNEL_ID as string,
  cmdPrefix: "!"
}

export default config
