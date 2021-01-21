import { fromUnixTime } from "date-fns"
import { scheduleJob, JobCallback } from "node-schedule"
import { Reminder } from "../../types"

export const scheduleRemindJob = (cb: JobCallback, reminder: Reminder) =>
  scheduleJob(fromUnixTime(reminder.remindAt), cb)
