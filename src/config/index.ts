import { CommandDictionary } from "../types"
import { DateTime } from "luxon"
import { writeFile } from "fs"
import remindHandler, { timeDict } from "../cmd-handlers/remind/remind"
import reminders from "../data/reminders.json"

export const remindersPath = `${process.cwd()}/src/data/reminders.json`

export const cmdChar = "!"

export const cmdDict: CommandDictionary = {
  remind: {
    aliases: ["remind", "r"],
    handler: remindHandler,
    deps: [reminders, remindersPath, writeFile, DateTime.local(), timeDict]
  }
}
