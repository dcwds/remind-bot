import { forEach } from "rambda"
import { scheduleJob } from "node-schedule"
import { writeFile } from "fs"
import { fromUnixTime } from "date-fns/fp"
import { Reminder } from "../../types"
import { activeReminders } from "./remind-selectors"
import reminders from "../../data/reminders.json"

export const makeReminderJobs = (
  activeReminders: readonly Reminder[],
  dateAPI: any,
  writeFileFn: Function
) => {
  return forEach((job: Reminder) => {
    return scheduleJob(dateAPI.fromUnixTime(job.remindAt), () => {
      console.log(job)
    })
  }, activeReminders)
}

export const reminderJobs = makeReminderJobs(
  activeReminders(reminders),
  {
    fromUnixTime
  },
  writeFile
)
