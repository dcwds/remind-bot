import { concat, filter, includes, sortBy, prop } from "rambda"
import { readFileSync, writeFileSync } from "fs"
import { reminderIds } from "../remind/remind-selectors"
import config from "../../config"
import { Reminder, DatabaseDependencies } from "../../types"

const sortById = sortBy(prop("id"))

export const readReminders = (deps: DatabaseDependencies): Reminder[] =>
  JSON.parse(deps.readFileFn(deps.remindersPath, "utf-8"))

export const updateReminders = (
  deps: DatabaseDependencies,
  reminders: Reminder[],
  remindersPayload: Reminder[]
) => {
  const updatedReminders = JSON.stringify(
    sortById(
      concat(
        remindersPayload,
        filter((r) => !includes(r.id, reminderIds(remindersPayload)), reminders)
      )
    )
  )

  deps.writeFileFn(deps.remindersPath, updatedReminders, "utf-8")
}

export const deleteReminders = (
  deps: DatabaseDependencies,
  reminders: Reminder[],
  remindersPayload: Reminder[]
) => {
  const updatedReminders = JSON.stringify(
    sortById(
      filter((r) => !includes(r.id, reminderIds(remindersPayload)), reminders)
    )
  )

  deps.writeFileFn(deps.remindersPath, updatedReminders, "utf-8")
}

export const withReminderDB = (
  operation: Function,
  remindersPayload?: Reminder[]
) => {
  const deps: DatabaseDependencies = {
    remindersPath: config.remindersPath,
    writeFileFn: writeFileSync,
    readFileFn: readFileSync
  }

  if (remindersPayload) {
    // Most operations require a reference to reminders
    // to properly update the DB.
    const reminders = readReminders(deps)

    operation(deps, reminders, remindersPayload)
  } else {
    return operation(deps)
  }
}
