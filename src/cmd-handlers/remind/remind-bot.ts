import config from "../../config"
import { TextChannel } from "discord.js"
import { Reminder } from "../../types"

export const sendWithBot = (
  messageFn: Function,
  channelId: string,
  reminder: Reminder
) => {
  const channel = config.discord.channels.cache.get(channelId) as TextChannel

  if (channel) {
    messageFn(channel, reminder)
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
