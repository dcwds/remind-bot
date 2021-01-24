import { readFileSync, writeFileSync } from "fs"

export type DatabaseDependencies = {
  remindersPath: string
  writeFileFn: typeof writeFileSync
  readFileFn: typeof readFileSync
}

export type DiscordMessage = {
  author: {
    id: string
    roles: readonly string[]
  }
  channelId: string
  content: string
}

export type CommandParserResults = {
  cmd: string | null
  handler: Function | null
  msg: DiscordMessage | null
  error: string | null
}

export type Command = {
  name: string
  aliases: string[]
  handler: Function
}

export type TimeUnit =
  | "seconds"
  | "minutes"
  | "hours"
  | "days"
  | "weeks"
  | "months"
  | "years"

export type Reminder = {
  id: number
  message: {
    authorId: string
    channelId: string
  }
  createdAt: number
  remindAt: number
  text: string
}
