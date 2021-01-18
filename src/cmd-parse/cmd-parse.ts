import { curry } from "rambda"
import { CommandDictionary, CommandParserResults } from "../types"

const cmdParse = (
  cmdChar: string,
  cmdDict: CommandDictionary,
  msg: string
): CommandParserResults => {
  const isCommandLike = cmdChar === msg.substring(0, 1)

  if (isCommandLike) {
    const command = msg.substring(1, msg.indexOf(" "))

    if (!!cmdDict[command]) {
      return {
        cmd: command,
        cmdHandler: cmdDict[command],
        parsedMsg: msg.substring(msg.indexOf(" ") + 1, msg.length),
        error: null
      }
    } else {
      return {
        cmd: null,
        cmdHandler: null,
        parsedMsg: null,
        error: `Could not find command ${command}`
      }
    }
  } else {
    return {
      cmd: null,
      cmdHandler: null,
      parsedMsg: null,
      error: "No command found."
    }
  }
}

export default curry(cmdParse)
