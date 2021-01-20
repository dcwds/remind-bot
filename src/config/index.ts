import { Client } from "discord.js"
import remindHandler from "../cmd-handlers/remind/remind"
import { CommandDictionary } from "../types"

export const discord = new Client()

export const remindersPath = `${process.cwd()}/src/data/reminders.json`

export const cmdPrefix = "!"

export const cmdDict: CommandDictionary = {
  remind: {
    aliases: ["remind", "r"],
    handler: remindHandler
  }
}
