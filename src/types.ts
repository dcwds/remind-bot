export type CommandParserResults = {
  cmd: string | null
  cmdHandler: Function | null
  parsedMsg: string | null
  error: string | null
}

export type CommandDictionary = {
  [key: string]: Function
}
