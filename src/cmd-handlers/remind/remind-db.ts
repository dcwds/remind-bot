import { append, filter, sortBy, prop } from "rambda"
import { readFileSync, NoParamCallback } from "fs"
import { Reminder, RemindDependencies } from "../../types"

const sortById = sortBy(prop("id"))

export const readRemindersFromDB = (
  remindersPath: string,
  readFileFn: typeof readFileSync
) => readFileFn(remindersPath, "utf-8")

export const writeReminderToDB = (
  reminder: Reminder,
  deps: RemindDependencies,
  cb: NoParamCallback
) => {
  const updatedReminders = JSON.stringify(
    sortById(append(reminder, deps.getReminders()))
  )

  deps.fileFns.writeFile(deps.remindersPath, updatedReminders, "utf-8", cb)
}

export const updateReminderInDB = (
  reminder: Reminder,
  deps: RemindDependencies,
  cb: NoParamCallback
) => {
  const updatedReminders = JSON.stringify(
    sortById(
      append(
        reminder,
        filter((r) => r.id !== reminder.id, deps.getReminders())
      )
    )
  )

  deps.fileFns.writeFile(deps.remindersPath, updatedReminders, "utf-8", cb)
}
