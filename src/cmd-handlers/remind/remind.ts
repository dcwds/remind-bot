import { append, find, includes, keys, length, match, reduce } from "rambda"
import { DateTime } from "luxon"
import { Reminder } from "../../types"

type TimeDictionary = typeof timeDict

export const timeDict = {
  seconds: ["s", "sec", "second", "secs", "seconds"],
  minutes: ["m", "min", "minute", "mins", "minutes"],
  hours: ["h", "hr", "hour", "hrs", "hours"],
  days: ["d", "day", "days"],
  weeks: ["w", "wk", "week", "wks", "weeks"],
  months: ["mo", "mth", "month", "mths", "months"],
  years: ["y", "year", "yrs", "years"]
}

const getReminderId = (reminders: Reminder[]) =>
  reduce((maxId, reminder) => Math.max(reminder.id, maxId), -1, reminders) + 1
const matchReminderTimeAmount = (msg: string) => match(/^\d+/, msg)
const matchReminderTimeUnit = (msg: string) => match(/(?<=\d+)[a-z]+/i, msg)
const matchReminderText = (msg: string) => match(/(?<=\s).*/, msg)

const getReminderTimeAmount = (amountMatch: readonly string[]) =>
  length(amountMatch) && !isNaN(Number(amountMatch[0]))
    ? Number(amountMatch[0])
    : null
const getReminderTimeUnit = (
  unitMatch: readonly string[],
  dict: TimeDictionary
) => {
  const unit = getTimeUnitFromDict(unitMatch[0], dict)

  if (unit) {
    return String(unit)
  } else {
    return null
  }
}
const getReminderText = (textMatch: readonly string[]) =>
  length(textMatch) ? textMatch[0] : null

const getTimeUnitFromDict = (unit: string | null, dict: TimeDictionary) =>
  find((keyword) => includes(unit, dict[keyword]), keys(dict))

export const getReminder = (
  msg: string,
  now: DateTime,
  reminders: Reminder[],
  timeDict: TimeDictionary
): Reminder | null => {
  const timeAmount = getReminderTimeAmount(matchReminderTimeAmount(msg))
  const timeUnit = getReminderTimeUnit(matchReminderTimeUnit(msg), timeDict)
  const text = getReminderText(matchReminderText(msg))

  if (timeAmount && timeUnit && text) {
    return {
      id: getReminderId(reminders),
      text,
      createdAt: now.toMillis(),
      remindAt: now.plus({ [timeUnit]: timeAmount }).toMillis()
    }
  } else {
    return null
  }
}

const remind = (
  msg: string,
  reminders: Reminder[],
  remindersPath: string,
  writeFileFn: Function,
  now: DateTime,
  timeDict: TimeDictionary
) => {
  const reminder = getReminder(msg, now, reminders, timeDict)

  if (reminder) {
    writeFileFn(
      remindersPath,
      JSON.stringify(append(reminder, reminders)),
      "utf8",
      () => console.log(`reminders:\n ${JSON.parse(JSON.stringify(reminders))}`)
    )
  }
}

export default remind
