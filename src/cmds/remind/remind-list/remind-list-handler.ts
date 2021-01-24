import { withReminderDB, readReminders } from "../remind-db"
import { sendWithBot, notifyWithActiveReminders } from "../remind-bot"
import { remindersByAuthorId } from "../remind-selectors"
import { Reminder, DiscordMessage } from "../../../types"
import config from "../../../config"

export default (msg: DiscordMessage) => {
  const authorReminders = remindersByAuthorId(
    msg.authorId,
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
