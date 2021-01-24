import { find } from "rambda"
import { withReminderDB, deleteReminders, readReminders } from "../remind-db"
import { sendWithBot, notifyWithDeletedReminder } from "../remind-bot"
import { remindersByAuthorIds } from "../remind-selectors"
import { hasDiscordPowerRole } from "../../../utils"
import { DiscordMessage, Reminder } from "../../../types"
import config from "../../../config"

export default (msg: DiscordMessage) => {
  const id = Number(msg.content)

  if (!isNaN(id)) {
    const reminders = withReminderDB(readReminders)
    let reminderToDelete

    if (hasDiscordPowerRole(msg.author.roles)) {
      reminderToDelete = find((r: Reminder) => r.id === id, reminders)
    } else {
      reminderToDelete = find(
        (r: Reminder) => r.id === id,
        remindersByAuthorIds([msg.author.id], reminders)
      )
    }

    if (reminderToDelete) {
      withReminderDB(deleteReminders, [reminderToDelete])

      sendWithBot(
        notifyWithDeletedReminder,
        config.remindChannelId,
        reminderToDelete
      )
    }
  }
}
