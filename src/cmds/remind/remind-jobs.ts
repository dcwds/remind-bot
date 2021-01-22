import { forEach, length } from "rambda"
import { fromUnixTime } from "date-fns"
import { scheduleJob } from "node-schedule"

import { withReminderDB, deleteReminders } from "../remind/remind-db"
import { join, map } from "rambda"
import {
  sendWithBot,
  notifyWithReminder,
  notifyWithMissedReminders
} from "../remind/remind-bot"
import { Reminder } from "../../types"

import config from "../../config"

export const scheduleRemindJobs = (reminders: Reminder[]) =>
  forEach(
    (r) => scheduleJob(fromUnixTime(r.remindAt), () => handleReminder(r)),
    reminders
  )

export const handleReminder = (reminder: Reminder) => {
  console.log(`reminder with id of ${reminder.id} has reminded.`)

  withReminderDB(deleteReminders, [reminder])

  sendWithBot(notifyWithReminder, config.remindChannelId, reminder)
}

export const handleMissedReminders = (reminders: Reminder[]) => {
  if (length(reminders)) {
    console.log(
      `Reminders with ids of ${join(
        ", ",
        map((r) => r.id, reminders)
      )} were missed.`
    )

    withReminderDB(deleteReminders, reminders)

    sendWithBot(notifyWithMissedReminders, config.remindChannelId, reminders)
  } else {
    console.log("No missed reminders found.")
  }
}
