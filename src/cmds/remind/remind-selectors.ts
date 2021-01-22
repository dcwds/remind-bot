import { difference, filter, map } from "rambda"
import { getUnixTime } from "date-fns"
import { Reminder } from "../../types"

export const reminderIds = (reminders: Reminder[]) =>
  map((r) => r.id, reminders)

export const activeReminders = (reminders: Reminder[]) =>
  filter((r) => r.remindAt > getUnixTime(new Date()), reminders)

export const missedReminders = (reminders: Reminder[]) =>
  difference(activeReminders(reminders), reminders)
