import { find, includes, keys, length, match, reduce } from "rambda"
import { writeReminderToDB, updateReminderInDB } from "./remind-db"
import { remindJob } from "./remind-jobs"
import { RemindDependencies, Reminder, DiscordMessage } from "../../types"

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
  deps: RemindDependencies
): Reminder | null => {
  const { getReminders, dateFns } = deps
  const { authorId, channelId, content } = msg

  const timeAmount = getReminderTimeAmount(matchReminderTimeAmount(content))
  const timeUnit = getReminderTimeUnit(matchReminderTimeUnit(content), timeDict)
  const parsedMessage = getReminderMessage(matchReminderMessage(content))

  if (timeAmount && timeUnit && parsedMessage) {
    const { getUnixTime, add } = dateFns
    const now = new Date()

    return {
      id: getReminderId(getReminders()),
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

const remind = (msg: DiscordMessage, deps: RemindDependencies) => {
  const reminder = getReminder(msg, deps)

  if (reminder) {
    console.log(`created reminder with id of ${reminder.id}`)

    writeReminderToDB(reminder, deps, () => {
      console.log(`reminder with id of ${reminder.id} has been written to db.`)

      remindJob(reminder, deps, () => {
        console.log(`reminder with id of ${reminder.id} has reminded.`)

        updateReminderInDB(
          { ...reminder, hasReminded: !reminder.hasReminded },
          deps,
          () => {
            console.log(
              `reminder with id of ${reminder.id} has hasReminded prop changed.`
            )
          }
        )
      })
    })
  }
}

export default remind
