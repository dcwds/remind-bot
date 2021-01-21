import { forEach } from "rambda"
import { fromUnixTime } from "date-fns"
import { scheduleJob } from "node-schedule"

import { withReminderDB, updateReminders } from "../remind/remind-db"
import { sendWithBot, notifyWithReminder } from "../remind/remind-bot"
import { Reminder } from "../../types"

import config from "../../config"

export const scheduleRemindJobs = (reminders: Reminder[]) =>
  forEach(
    (r) => scheduleJob(fromUnixTime(r.remindAt), () => reminderAction(r)),
    reminders
  )

export const reminderAction = (reminder: Reminder) => {
  console.log(`reminder with id of ${reminder.id} has reminded.`)

  withReminderDB(updateReminders, [
    {
      ...reminder,
      hasReminded: !reminder.hasReminded
    }
  ])

  sendWithBot(notifyWithReminder, config.remindChannelId, reminder)
}
