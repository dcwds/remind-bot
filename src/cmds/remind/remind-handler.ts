import config from "../../config"
import prepareReminder from "./remind-prepare"
import {
  withReminderDB,
  writeReminder,
  updateReminder,
  readReminders
} from "./remind-db"
import {
  sendWithBot,
  acknowledgeReminder,
  notifyWithReminder
} from "./remind-bot"
import { scheduleRemindJob } from "./remind-jobs"
import { DiscordMessage } from "../../types"

export default (msg: DiscordMessage) => {
  const reminder = prepareReminder(msg, withReminderDB(readReminders))

  if (reminder) {
    console.log(`created reminder with id of ${reminder.id}`)

    withReminderDB(writeReminder, reminder)

    sendWithBot(acknowledgeReminder, reminder.message.channelId, reminder)

    scheduleRemindJob(() => {
      console.log(`reminder with id of ${reminder.id} has reminded.`)

      withReminderDB(updateReminder, {
        ...reminder,
        hasReminded: !reminder.hasReminded
      })

      sendWithBot(notifyWithReminder, config.remindChannelId, reminder)
    }, reminder)
  }
}
