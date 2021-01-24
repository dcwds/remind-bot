import { withReminderDB, readReminders } from "../remind-db"
import { sendWithBot, notifyWithActiveReminders } from "../remind-bot"
import { remindersByAuthorIds } from "../remind-selectors"
import { Reminder, DiscordMessage } from "../../../types"
import config from "../../../config"

export default (msg: DiscordMessage) => {
  const authorReminders = remindersByAuthorIds(
    [msg.author.id],
    withReminderDB(readReminders)
  ) as Reminder[]

  if (authorReminders) {
    sendWithBot(
      notifyWithActiveReminders,
      config.remindChannelId,
      authorReminders
    )
  }
}
