import { curry, find, includes, keys } from "rambda"
import {
  CommandDictionary,
  CommandParserResults,
  DiscordMessage
} from "../types"

const cmdParse = (
  cmdChar: string,
  cmdDict: CommandDictionary,
  msg: DiscordMessage
): CommandParserResults => {
  const { authorId, channelId, content } = msg
  const isCommandLike = cmdChar === content.substring(0, 1)

  if (isCommandLike) {
    const parsedCmd = content.substring(1, content.indexOf(" "))
    const cmdFromDict = find(
      (cmd: string) => includes(parsedCmd, cmdDict[cmd].aliases),
      keys(cmdDict) as string[]
    )

    if (cmdFromDict) {
      return {
        cmd: cmdFromDict,
        handler: cmdDict[cmdFromDict].handler,
        deps: cmdDict[cmdFromDict].deps,
        msg: {
          authorId,
          channelId,
          content: content.substring(content.indexOf(" ") + 1, content.length)
        },
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
