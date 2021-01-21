import { filter } from "rambda"
import { Reminder } from "../../types"

export const activeReminders = (reminders: Reminder[]) =>
  filter(({ hasReminded }: Reminder) => !hasReminded, reminders)

export const missedReminders = (reminders: Reminder[], dateAPI: any) => {
  const now = new Date()

  return filter(
    ({ remindAt, hasReminded }) =>
      dateAPI.getUnixTime(now) > remindAt && !hasReminded,
    reminders
  )
}
