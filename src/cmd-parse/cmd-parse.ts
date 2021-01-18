import { curry, find, includes, keys } from "rambda"
import { CommandDictionary, CommandParserResults } from "../types"

const cmdParse = (
  cmdChar: string,
  cmdDict: CommandDictionary,
  msg: string
): CommandParserResults => {
  const isCommandLike = cmdChar === msg.substring(0, 1)

  if (isCommandLike) {
    const parsedCmd = msg.substring(1, msg.indexOf(" "))
    const cmdFromDict = find(
      (cmd: string) => includes(parsedCmd, cmdDict[cmd].aliases),
      keys(cmdDict) as string[]
    )

    if (cmdFromDict) {
      return {
        cmd: cmdFromDict,
        handler: cmdDict[cmdFromDict].handler,
        deps: cmdDict[cmdFromDict].deps,
        msg: msg.substring(msg.indexOf(" ") + 1, msg.length),
        error: null
      }
    } else {
      return {
        cmd: null,
        handler: null,
        deps: null,
        msg: null,
        error: `Could not find command ${parsedCmd}`
      }
    }
  } else {
    return {
      cmd: null,
      handler: null,
      deps: null,
      msg: null,
      error: "No command found."
    }
  }
}

export default curry(cmdParse)
