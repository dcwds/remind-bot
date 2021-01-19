import { append, sortBy, prop } from "rambda"
import { Reminder } from "../../types"

const sortById = sortBy(prop("id"))

export const writeReminderToDB = (
  reminder: Reminder,
  reminders: Reminder[],
  remindersPath: string,
  writeFileFn: Function,
  cb: Function
) =>
  writeFileFn(
    remindersPath,
    JSON.stringify(sortById(append(reminder, reminders))),
    "utf8",
    cb
  )
