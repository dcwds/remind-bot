import { append, find, includes, keys, length, match, reduce } from "rambda"
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
const matchReminderMessage = (msg: string) => match(/(?<=\s).*/, msg)

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
const getReminderMessage = (textMatch: readonly string[]) =>
  length(textMatch) ? textMatch[0] : null

const getTimeUnitFromDict = (unit: string | null, dict: TimeDictionary) =>
  find((keyword) => includes(unit, dict[keyword]), keys(dict))

export const getReminder = (
  msg: string,
  dateAPI: any,
  reminders: Reminder[],
  timeDict: TimeDictionary
): Reminder | null => {
  const timeAmount = getReminderTimeAmount(matchReminderTimeAmount(msg))
  const timeUnit = getReminderTimeUnit(matchReminderTimeUnit(msg), timeDict)
  const message = getReminderMessage(matchReminderMessage(msg))

  if (timeAmount && timeUnit && message) {
    const { getUnixTime, add } = dateAPI
    const now = new Date()

    return {
      id: getReminderId(reminders),
      message,
      createdAt: getUnixTime(now),
      remindAt: getUnixTime(add({ [timeUnit]: timeAmount }, now)),
      hasReminded: false
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
  dateAPI: any,
  timeDict: TimeDictionary
) => {
  const reminder = getReminder(msg, dateAPI, reminders, timeDict)

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
