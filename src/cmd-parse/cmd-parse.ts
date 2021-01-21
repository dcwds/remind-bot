import { curry, find, includes } from "rambda"
import { Command, CommandParserResults, DiscordMessage } from "../types"

const cmdParse = (
  cmdPrefix: string,
  cmds: Command[],
  msg: DiscordMessage
): CommandParserResults => {
  const { authorId, channelId, content } = msg
  const isCommandLike = cmdPrefix === content.substring(0, 1)

  if (isCommandLike) {
    const parsedCmd = content.substring(1, content.indexOf(" "))
    const foundCmd = find(
      (cmd: Command) => includes(parsedCmd, cmd.aliases),
      cmds
    )

    if (foundCmd) {
      return {
        cmd: foundCmd.name,
        handler: foundCmd.handler,
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
        msg: null,
        error: `Could not find command ${parsedCmd}`
      }
    }
  } else {
    return {
      cmd: null,
      handler: null,
      msg: null,
      error: "No command found."
    }
  }
}

export default curry(cmdParse)
