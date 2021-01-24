import { filter, forEach, join, map, uniq } from "rambda"
import { discord } from "../.."
import { formatToPrettyDate } from "../../utils"
import { TextChannel } from "discord.js"
import { Reminder } from "../../types"
import config from "../../config"

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
    title: `:alarm_clock:\u2000${reminder.text}`,
    description: `Scheduled by <@${
      reminder.message.authorId
    }> for ${formatToPrettyDate(reminder.createdAt, reminder.remindAt)}`,
    footer: {
      text: `To delete, use: ${config.cmdPrefix}rd ${reminder.id}`
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
    title: `:alarm_clock:\u2000${reminder.text}`,
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
        (r: Reminder) => r.text,
        filter((r) => r.message.authorId === id, reminders)
      )
    )

    channel.send(
      `<@${id}>\nSorry, while I was not running, the following reminders were missed:\n${remindersByAuthor}`
    )
  }, authorIds)
}

export const notifyWithActiveReminders = (
  channel: TextChannel,
  reminders: Reminder[]
) => {
  const authorId = reminders[0].message.authorId
  const remindersBlurb = join(
    "\n\n",
    map(
      (r) =>
        `**${r.text}**\nScheduled for ${formatToPrettyDate(
          r.createdAt,
          r.remindAt
        )} \u2013 ID ${r.id}`,
      reminders
    )
  )

  const embed = {
    color: "#4F46E5",
    title: ":alarm_clock:\u2000Reminders",
    description: `<@${authorId}>, you have ${reminders.length} reminders scheduled.\n\n${remindersBlurb}`,
    footer: {
      text: `To delete a reminder, use ${config.cmdPrefix}rd followed by an ID`
    }
  }

  channel.send({ embed })
}
