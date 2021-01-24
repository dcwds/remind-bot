import Discord from "discord.js"
import cmds from "./cmds"
import cmdParse from "./cmd-parse"

import {
  scheduleRemindJobs,
  handleMissedReminders
} from "./cmds/remind/remind-jobs"
import { withReminderDB, readReminders } from "./cmds/remind/remind-db"
import {
  activeReminders,
  missedReminders
} from "./cmds/remind/remind-selectors"

import config from "./config"
import { Reminder } from "./types"

export const discord = new Discord.Client()

discord.on("ready", () => {
  const reminders = withReminderDB(readReminders)

  console.log("listening.")

  // If the process is terminated, queue any reminders that
  // have not yet reminded.
  scheduleRemindJobs(activeReminders(reminders) as Reminder[])

  // If any reminder jobs were never executed due to the process
  // being terminated, then we notify reminder authors of the
  // reminders that have been missed and remove them.
  handleMissedReminders(missedReminders(reminders) as Reminder[])
})

discord.on("message", (message) => {
  const { cmd, handler, msg } = cmdParse(config.cmdPrefix, cmds, {
    authorId: message.author.id,
    channelId: message.channel.id,
    content: message.content
  })

  if (cmd) {
    handler(msg)
  }
})

discord.login(config.discordBotToken)
