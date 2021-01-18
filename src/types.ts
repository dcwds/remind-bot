export type CommandParserResults = {
  cmd: string | null
  cmdHandler: Function | null
  parsedMsg: string | null
  error: string | null
}

export type CommandDictionary = {
  [key: string]: Function
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
