import { any, includes, pipe, length, map, match } from "rambda"
import { fromUnixTime } from "date-fns/fp"
import { formatRelative } from "date-fns"
import enUS from "date-fns/locale/en-US"
import { GuildMember, Role } from "discord.js"
import config from "./config"

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

export const getMatchWithRegex = pipe(
  (pattern: RegExp, str: string) => match(pattern, str),
  (matches: readonly string[]) => (length(matches) ? matches[0] : null)
)

export const getDiscordRoleIds = (member: GuildMember | null) => {
  if (member)
    return map((role) => role.id, member.roles.cache.array() as Role[])
  else return []
}

export const hasDiscordPowerRole = (roleIds: readonly string[]) =>
  any((id) => includes(id, roleIds), config.discordPowerRoleIds)
