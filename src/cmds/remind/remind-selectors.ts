import { filter } from "rambda"
import { getUnixTime } from "date-fns"
import { Reminder } from "../../types"

export const activeReminders = (reminders: Reminder[]) =>
  filter(({ hasReminded }: Reminder) => !hasReminded, reminders)

export const missedReminders = (reminders: Reminder[]) => {
  const now = new Date()

  return filter(
    ({ remindAt, hasReminded }) => getUnixTime(now) > remindAt && !hasReminded,
    reminders
  )
}
