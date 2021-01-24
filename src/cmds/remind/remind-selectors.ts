import { difference, filter, map, reduce } from "rambda"
import { getUnixTime } from "date-fns"
import { Reminder } from "../../types"

export const nextReminderId = (reminders: Reminder[]) =>
  reduce((maxId, reminder) => Math.max(reminder.id, maxId), -1, reminders) + 1

export const reminderIds = (reminders: Reminder[]) =>
  map((r) => r.id, reminders)

export const activeReminders = (reminders: Reminder[]) =>
  filter((r) => r.remindAt > getUnixTime(new Date()), reminders)

export const missedReminders = (reminders: Reminder[]) =>
  difference(reminders, activeReminders(reminders))

export const remindersByAuthorId = (authorId: string, reminders: Reminder[]) =>
  filter((r) => r.message.authorId === authorId, reminders)
