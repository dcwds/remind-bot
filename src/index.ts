import Discord from "discord.js"
import cmds from "./cmds"
import cmdParse from "./cmd-parse"
import config from "./config"

export const discord = new Discord.Client()

discord.on("ready", () => {
  console.log("listening.")
})

discord.on("message", (message) => {
  const { cmd, handler, msg } = cmdParse("!", cmds, {
    authorId: message.author.id,
    channelId: message.channel.id,
    content: message.content
  })

  if (cmd) {
    handler(msg)
  }
})

discord.login(config.discordBotToken)
