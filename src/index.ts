import dotenv from "dotenv"
import Discord from "discord.js"
import cmdParse from "./cmd-parse"
import { cmdChar, cmdDict, remindDeps } from "./config"
import { scheduleReminderJobs } from "./cmd-handlers/remind/remind-jobs"

dotenv.config()

const client = new Discord.Client()

client.on("ready", () => {
  console.log("listening.")

  /*
  scheduleReminderJobs(remindDeps, () => {
    console.log("")
  })
  */
})

client.on("message", (message) => {
  const { cmd, handler, deps, msg } = cmdParse(cmdChar, cmdDict, {
    authorId: message.author.id,
    channelId: message.channel.id,
    content: message.content
  })

  if (cmd) {
    handler(msg, deps)
  }
})

client.login(process.env.DISCORD_BOT_TOKEN)
