import { CommandDictionary } from "../types"
import remindHandler from "../cmd-handlers/remind"

export const cmdChar = "!"

export const cmdDict: CommandDictionary = {
  remind: remindHandler
}

export const remindersPath = `${process.cwd()}/src/data/reminders.json`
