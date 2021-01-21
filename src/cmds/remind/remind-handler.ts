import prepareReminder from "./remind-prepare"
import { withReminderDB, updateReminders, readReminders } from "./remind-db"
import { sendWithBot, acknowledgeReminder } from "./remind-bot"
import { scheduleRemindJobs } from "./remind-jobs"
import { DiscordMessage } from "../../types"

export default (msg: DiscordMessage) => {
  const reminder = prepareReminder(msg, withReminderDB(readReminders))

  if (reminder) {
    console.log(`created reminder with id of ${reminder.id}`)

    withReminderDB(updateReminders, [reminder])

    sendWithBot(acknowledgeReminder, reminder.message.channelId, reminder)

    scheduleRemindJobs([reminder])
  }
}
