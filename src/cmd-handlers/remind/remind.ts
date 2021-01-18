import { append, find, includes, keys, length, match, reduce } from "rambda"
import { DateTime } from "luxon"
import { Reminder } from "../../types"
import { writeFile, NoParamCallback } from "fs"
import { remindersPath } from "../../config"
import reminders from "../../data/reminders.json"

type TimeUnitKeywordsDictionary = typeof timeUnitKeywordsDict

const timeUnitKeywordsDict = {
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
  unitKeywordMatch: readonly string[],
  keywordMap: TimeUnitKeywordsDictionary
) => {
  const unit = getTimeUnitFromDict(unitKeywordMatch[0], keywordMap)

  if (unit) {
    return String(unit)
  } else {
    return null
  }
}
const getReminderText = (textMatch: readonly string[]) =>
  length(textMatch) ? textMatch[0] : null

const getTimeUnitFromDict = (
  unit: string | null,
  dict: TimeUnitKeywordsDictionary
) => find((keyword) => includes(unit, dict[keyword]), keys(dict))

export const getReminder = (
  msg: string,
  now: DateTime,
  reminders: Reminder[]
): Reminder | null => {
  const timeAmount = getReminderTimeAmount(matchReminderTimeAmount(msg))
  const timeUnit = getReminderTimeUnit(
    matchReminderTimeUnit(msg),
    timeUnitKeywordsDict
  )
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

export const writeReminderToFile = (
  reminder: Reminder,
  reminders: Reminder[],
  path: string,
  cb: NoParamCallback
) => writeFile(path, JSON.stringify(append(reminder, reminders)), "utf8", cb)

const remind = (msg: string) => {
  const reminder = getReminder(msg, DateTime.local(), reminders)

  if (reminder) {
    writeReminderToFile(reminder, reminders, remindersPath, () =>
      console.log(`reminders:\n ${JSON.parse(JSON.stringify(reminders))}`)
    )
  }
}

export default remind
