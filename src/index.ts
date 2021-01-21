import Discord from "discord.js"
import cmds from "./cmds"
import cmdParse from "./cmd-parse"

import { scheduleRemindJobs } from "./cmds/remind/remind-jobs"
import { withReminderDB, readReminders } from "./cmds/remind/remind-db"
import { activeReminders } from "./cmds/remind/remind-selectors"

import config from "./config"
import { Reminder } from "./types"

export const discord = new Discord.Client()

discord.on("ready", () => {
  console.log("listening.")

  // If the main process gets terminated, it's important to
  // queue any reminders that have not reminded once the process
  // is run again.
  scheduleRemindJobs(
    activeReminders(withReminderDB(readReminders)) as Reminder[]
  )
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
