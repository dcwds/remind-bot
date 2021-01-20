import { scheduleJob } from "node-schedule"
import { readFileSync, writeFile } from "fs"
import { add, getUnixTime, fromUnixTime } from "date-fns/fp"
import { timeDict } from "./cmd-handlers/remind/remind"

export type Dependencies = RemindDependencies

export type DiscordMessage = {
  authorId: string
  channelId: string
  content: string
}

export type CommandParserResults = {
  cmd: string | null
  handler: Function | null
  deps: Dependencies | null
  msg: DiscordMessage | null
  error: string | null
}

export type CommandDictionary = {
  [key: string]: {
    aliases: string[]
    handler: Function
    deps: Dependencies
  }
}

export type TimeUnit =
  | "seconds"
  | "minutes"
  | "hours"
  | "days"
  | "weeks"
  | "months"
  | "years"

export type RemindDependencies = {
  getReminders: () => Reminder[]
  remindersPath: string
  fileFns: {
    writeFile: typeof writeFile
    readFile: typeof readFileSync
  }
  dateFns: {
    getUnixTime: typeof getUnixTime
    fromUnixTime: typeof fromUnixTime
    add: typeof add
  }
  timeDict: typeof timeDict
  scheduler: typeof scheduleJob
}

export type Reminder = {
  id: number
  message: DiscordMessage
  createdAt: number
  remindAt: number
  hasReminded: boolean
}
