export type DiscordMessage = {
  authorId: string
  channelId: string
  content: string
}

export type CommandParserResults = {
  cmd: string | null
  handler: Function | null
  deps: any[] | null
  msg: DiscordMessage | null
  error: string | null
}

export type CommandDictionary = {
  [key: string]: {
    aliases: string[]
    handler: Function
    deps: any[]
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

export type Reminder = {
  id: number
  message: DiscordMessage
  createdAt: number
  remindAt: number
  hasReminded: boolean
}
