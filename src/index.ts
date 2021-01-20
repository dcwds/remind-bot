import cmdParse from "./cmd-parse"
import config from "./config"

const { discord, discordBotToken, cmdPrefix, cmdDict } = config

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

discord.login(discordBotToken)
