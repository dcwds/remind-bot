import { fromUnixTime } from "date-fns/fp"
import { formatRelative } from "date-fns"
import enUS from "date-fns/locale/en-US"

const customDateFormatting: any = {
  lastWeek: "'last' eee 'at' p",
  yesterday: "'yesterday at' p",
  today: "'today at' p",
  tomorrow: "'tomorrow at' p",
  nextWeek: "eee 'at' p",
  other: "PP 'at' p"
}

export const formatToPrettyDate = (
  baseDateTimestamp: number,
  dateTimestamp: number
) =>
  formatRelative(fromUnixTime(dateTimestamp), fromUnixTime(baseDateTimestamp), {
    locale: {
      ...enUS,
      formatRelative: (token) => customDateFormatting[token]
    }
  })
