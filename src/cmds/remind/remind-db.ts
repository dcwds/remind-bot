import { append, concat, filter, includes, sortBy, prop, map } from "rambda"
import { readFileSync, writeFileSync } from "fs"
import config from "../../config"
import { Reminder, DatabaseDependencies } from "../../types"

const sortById = sortBy(prop("id"))

export const readReminders = (deps: DatabaseDependencies) =>
  JSON.parse(deps.readFileFn(deps.remindersPath, "utf-8"))

export const updateReminders = (
  deps: DatabaseDependencies,
  reminders: Reminder[],
  remindersToUpdate: Reminder[]
) => {
  const reminderIdsToUpdate = map((r) => r.id, remindersToUpdate)
  const updatedReminders = JSON.stringify(
    sortById(
      concat(
        remindersToUpdate,
        filter((r) => !includes(r.id, reminderIdsToUpdate), reminders)
      )
    )
  )

  deps.writeFileFn(deps.remindersPath, updatedReminders, "utf-8")
}

export const withReminderDB = (
  operation: Function,
  remindersToUpdate?: Reminder[]
) => {
  const deps: DatabaseDependencies = {
    remindersPath: config.remindersPath,
    writeFileFn: writeFileSync,
    readFileFn: readFileSync
  }

  if (remindersToUpdate) {
    // Most operations require a reference to reminders
    // to properly update the DB.
    const reminders = readReminders(deps)

    operation(deps, reminders, remindersToUpdate)
  } else {
    return operation(deps)
  }
}
