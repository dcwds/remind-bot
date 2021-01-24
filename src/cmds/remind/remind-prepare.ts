import { drop, find, includes, join, keys, map, split, trim } from "rambda"
import { add, getUnixTime } from "date-fns/fp"
import { nextReminderId } from "../remind/remind-selectors"
import { getMatchWithRegex } from "../../utils"
import { Reminder, DiscordMessage } from "../../types"

export const timeDict = {
  seconds: ["s", "sec", "second", "secs", "seconds"],
  minutes: ["m", "min", "minute", "mins", "minutes"],
  hours: ["h", "hr", "hour", "hrs", "hours"],
  days: ["d", "day", "days"],
  weeks: ["w", "wk", "week", "wks", "weeks"],
  months: ["mo", "mth", "month", "mths", "months"],
  years: ["y", "year", "yrs", "years"]
}

export default (
  msg: DiscordMessage,
  reminders: Reminder[]
): Reminder | null => {
  const { authorId, channelId, content } = msg
  const msgArgs = map(trim, split(" ", content))

  const timeAmount = getMatchWithRegex(new RegExp("^\\d+", "i"), msgArgs[0])
  const timeUnit = find(
    (keyword) =>
      includes(
        getMatchWithRegex(new RegExp("[^\\d+].*", "i"), msgArgs[0]),
        timeDict[keyword]
      ),
    keys(timeDict)
  )
  const text = join(" ", drop(1, msgArgs))

  if (!isNaN(Number(timeAmount)) && timeUnit && text) {
    const now = new Date()

    return {
      id: nextReminderId(reminders),
      message: {
        authorId,
        channelId
      },
      createdAt: getUnixTime(now),
      remindAt: getUnixTime(add({ [timeUnit]: Number(timeAmount) }, now)),
      text
    }
  } else {
    return null
  }
}
