import { append, find, includes, keys, length, match, reduce } from "rambda"
import { writeReminderToDB } from "./remind-db"
import { Reminder, DiscordMessage } from "../../types"

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
  msg: DiscordMessage,
  reminders: Reminder[],
  dateAPI: any,
  timeDict: TimeDictionary
): Reminder | null => {
  const { authorId, channelId, content } = msg
  const timeAmount = getReminderTimeAmount(matchReminderTimeAmount(content))
  const timeUnit = getReminderTimeUnit(matchReminderTimeUnit(content), timeDict)
  const parsedMessage = getReminderMessage(matchReminderMessage(content))

  if (timeAmount && timeUnit && parsedMessage) {
    const { getUnixTime, add } = dateAPI
    const now = new Date()

    return {
      id: getReminderId(reminders),
      message: {
        authorId,
        channelId,
        content: parsedMessage
      },
      createdAt: getUnixTime(now),
      remindAt: getUnixTime(add({ [timeUnit]: timeAmount }, now)),
      hasReminded: false
    }
  } else {
    return null
  }
}

const remind = (
  msg: DiscordMessage,
  reminders: Reminder[],
  remindersPath: string,
  writeFileFn: Function,
  dateAPI: any,
  timeDict: TimeDictionary
) => {
  const reminder = getReminder(msg, reminders, dateAPI, timeDict)

  if (reminder) {
    writeReminderToDB(reminder, reminders, remindersPath, writeFileFn, () =>
      console.log("Reminder written to database.")
    )
  }
}

export default remind
