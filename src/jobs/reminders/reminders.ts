import { filter, forEach, map } from "rambda"
import { scheduleJob } from "node-schedule"
import { Reminder, ReminderJob } from "../../types"

export const remindersJobQueue = (reminders: Reminder[], dateAPI: any) =>
  map(
    ({ id, message, remindAt }: Reminder) => {
      return { id, message, remindAt: dateAPI.fromUnixTime(remindAt) }
    },
    filter(({ hasReminded }: Reminder) => !hasReminded, reminders)
  )

export const makeReminderJobs = (
  queue: Function,
  reminders: Reminder[],
  dateAPI: any
) =>
  forEach(
    (job: ReminderJob) =>
      scheduleJob(job.remindAt, () => {
        console.log(job)
      }),
    queue(reminders, dateAPI)
  )
