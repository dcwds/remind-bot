import { append, filter, sortBy, prop } from "rambda"
import { readFileSync, writeFileSync } from "fs"
import config from "../../config"
import { Reminder, DatabaseDependencies } from "../../types"

const sortById = sortBy(prop("id"))

export const readReminders = (deps: DatabaseDependencies) =>
  JSON.parse(deps.readFileFn(deps.remindersPath, "utf-8"))

export const writeReminder = (
  deps: DatabaseDependencies,
  reminder: Reminder,
  reminders: Reminder[]
) => {
  const updatedReminders = JSON.stringify(sortById(append(reminder, reminders)))

  deps.writeFileFn(deps.remindersPath, updatedReminders, "utf-8")
}

export const updateReminder = (
  deps: DatabaseDependencies,
  reminder: Reminder,
  reminders: Reminder[]
) => {
  const updatedReminders = JSON.stringify(
    sortById(
      append(
        reminder,
        filter((r) => r.id !== reminder.id, reminders)
      )
    )
  )

  deps.writeFileFn(deps.remindersPath, updatedReminders, "utf-8")
}

export const withReminderDB = (operation: Function, reminder?: Reminder) => {
  const deps: DatabaseDependencies = {
    remindersPath: config.remindersPath,
    writeFileFn: writeFileSync,
    readFileFn: readFileSync
  }

  if (reminder) {
    // Reminder operations require a reference to reminders
    // to properly update the DB.
    const reminders = readReminders(deps)

    return operation(deps, reminder, reminders)
  } else {
    return operation(deps)
  }
}
