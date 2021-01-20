import { forEach } from "rambda"
import { activeReminders } from "./remind-selectors"
import { JobCallback } from "node-schedule"
import { Reminder, RemindDependencies } from "../../types"

export const remindJob = (
  reminder: Reminder,
  deps: RemindDependencies,
  cb: JobCallback
) => {
  console.log("remind job queued.")

  return deps.scheduler(deps.dateFns.fromUnixTime(reminder.remindAt), cb)
}

export const scheduleReminderJobs = (
  deps: RemindDependencies,
  cb: JobCallback
) =>
  forEach(
    (reminder: Reminder) => remindJob(reminder, deps, cb),
    activeReminders(deps.getReminders())
  )
