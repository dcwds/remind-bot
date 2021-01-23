import { filter, forEach, join, map, uniq } from "rambda"
import { discord } from "../.."
import { formatToPrettyDate } from "../../utils"
import { TextChannel } from "discord.js"
import { Reminder } from "../../types"

export const sendWithBot = (
  messageFn: Function,
  channelId: string,
  payload: Reminder | Reminder[]
) => {
  const channel = discord.channels.cache.get(channelId) as TextChannel

  if (channel) {
    messageFn(channel, payload)
  } else {
    console.log(`Cannot send to channel with id of ${channelId}`)
  }
}

export const acknowledgeReminder = (
  channel: TextChannel,
  reminder: Reminder
) => {
  const embed = {
    color: "#4F46E5",
    title: `:alarm_clock:\u2000${reminder.message.content}`,
    description: `Scheduled by <@${
      reminder.message.authorId
    }> for ${formatToPrettyDate(reminder.createdAt, reminder.remindAt)}`,
    footer: {
      text: `To delete, use: !r-del ${reminder.id}`
    }
  }

  channel.send({ embed })
}

export const notifyWithReminder = (
  channel: TextChannel,
  reminder: Reminder
) => {
  const embed = {
    color: "#FCD34D",
    title: `:alarm_clock:\u2000${reminder.message.content}`,
    description: `<@${reminder.message.authorId}>, you have been reminded :smile:`
  }

  channel.send({ embed })
}
export const notifyWithMissedReminders = (
  channel: TextChannel,
  reminders: Reminder[]
) => {
  const authorIds = uniq(map((r) => r.message.authorId, reminders))

  forEach((id) => {
    const remindersByAuthor = join(
      "\n",
      map(
        (r: Reminder) => r.message.content,
        filter((r) => r.message.authorId === id, reminders)
      )
    )

    channel.send(
      `<@${id}>\nSorry, while I was not running, the following reminders were missed:\n${remindersByAuthor}`
    )
  }, authorIds)
}
