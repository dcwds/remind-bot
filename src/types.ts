export type CommandParserResults = {
  cmd: string | null
  handler: Function | null
  deps: any[] | null
  msg: string | null
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
  text: string
  createdAt: number
  remindAt: number
}
