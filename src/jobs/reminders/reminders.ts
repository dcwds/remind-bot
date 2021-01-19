import { filter, forEach, map } from "rambda"
import { fromUnixTime } from "date-fns/fp"
import { scheduleJob } from "node-schedule"
import { Reminder, ReminderJob } from "../../types"
import reminders from "../../data/reminders.json"

export const remindersJobQueue = (reminders: Reminder[], dateAPI: any) =>
  map(
    ({ id, message, remindAt }: Reminder) => {
      return { id, message, remindAt: dateAPI.fromUnixTime(remindAt) }
    },
    filter(({ hasReminded }: Reminder) => !hasReminded, reminders)
  )

export const makeReminderJobs = (
  reminders: Reminder[],
  queue: Function,
  dateAPI: any
) =>
  forEach(
    (job: ReminderJob) =>
      scheduleJob(job.remindAt, () => {
        console.log(job)
      }),
    queue(reminders, dateAPI)
  )

export const reminderJobs = makeReminderJobs(reminders, remindersJobQueue, {
  fromUnixTime
})
