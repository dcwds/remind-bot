import dotenv from "dotenv"
import cmdParse from "./cmd-parse"
import { cmdPrefix, cmdDict, discord } from "./config"

dotenv.config()

discord.on("ready", () => {
  console.log("listening.")
})

discord.on("message", (message) => {
  const { cmd, handler, msg } = cmdParse(cmdPrefix, cmdDict, {
    authorId: message.author.id,
    channelId: message.channel.id,
    content: message.content
  })

  if (cmd) {
    handler(msg)
  }
})

discord.login(process.env.DISCORD_BOT_TOKEN)
