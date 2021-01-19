import Discord from "discord.js"
import dotenv from "dotenv"
import cmdParse from "./cmd-parse"
import { cmdChar, cmdDict } from "./config"

dotenv.config()

const client = new Discord.Client()

client.on("ready", () => {
  console.log("listening.")
})

client.on("message", (message) => {
  const { cmd, handler, deps, msg } = cmdParse(cmdChar, cmdDict, {
    authorId: message.author.id,
    channelId: message.channel.id,
    content: message.content
  })

  if (cmd) {
    handler(msg, ...deps)
  }
})

client.login(process.env.DISCORD_BOT_TOKEN)
