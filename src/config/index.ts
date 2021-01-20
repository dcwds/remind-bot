import { scheduleJob } from "node-schedule"
import { getUnixTime, fromUnixTime, add } from "date-fns/fp"
import { readFileSync, writeFile } from "fs"
import remindHandler, { timeDict } from "../cmd-handlers/remind/remind"
import { readRemindersFromDB } from "../cmd-handlers/remind/remind-db"
import { CommandDictionary, RemindDependencies } from "../types"

export const remindersPath = `${process.cwd()}/src/data/reminders.json`

export const remindDeps: RemindDependencies = {
  getReminders: () =>
    JSON.parse(readRemindersFromDB(remindersPath, readFileSync)),
  remindersPath,
  fileFns: {
    readFile: readFileSync,
    writeFile
  },
  dateFns: { getUnixTime, fromUnixTime, add },
  timeDict,
  scheduler: scheduleJob
}

export const cmdChar = "!"

export const cmdDict: CommandDictionary = {
  remind: {
    aliases: ["remind", "r"],
    handler: remindHandler,
    deps: remindDeps
  }
}
