import { filter, forEach, join, map, uniq } from "rambda"
import { discord } from "../.."
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

export const acknowledgeReminder = (channel: TextChannel, reminder: Reminder) =>
  channel.send(
    `<@${reminder.message.authorId}>\nScheduled: ${reminder.message.content}`
  )

export const notifyWithReminder = (channel: TextChannel, reminder: Reminder) =>
  channel.send(
    `<@${reminder.message.authorId}>\n Reminder: ${reminder.message.content}`
  )

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
