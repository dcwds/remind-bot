import { TextChannel } from "discord.js"
import { discord } from "../../config"
import { Reminder } from "../../types"

export const sendWithBot = (messageFn: Function, reminder: Reminder) => {
  const channel = discord.channels.cache.get(
    reminder.message.channelId
  ) as TextChannel

  if (channel) {
    messageFn(channel, reminder)
  } else {
    console.log(
      `Cannot send to channel with id of ${reminder.message.channelId}`
    )
  }
}

export const acknowledgeReminder = (
  channel: TextChannel,
  reminder: Reminder
) => {
  channel.send(
    `<@${reminder.message.authorId}>\nScheduled: ${reminder.message.content}`
  )
}
