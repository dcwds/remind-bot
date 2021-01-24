import { curry, drop, find, includes, join, map, split, trim } from "rambda"
import { getMatchWithRegex } from "../utils"
import { Command, CommandParserResults, DiscordMessage } from "../types"

const cmdParse = (
  cmdPrefix: string,
  cmds: Command[],
  msg: DiscordMessage
): CommandParserResults => {
  const { authorId, channelId, content } = msg
  const msgArgs = map(trim, split(" ", content))

  const foundCmdPrefix = getMatchWithRegex(
    new RegExp(`^${cmdPrefix}`, "i"),
    msgArgs[0]
  )

  if (foundCmdPrefix) {
    const cmdLike = getMatchWithRegex(
      new RegExp(`[^${cmdPrefix}].*`, "i"),
      msgArgs[0]
    )

    const foundCmd = find((cmd) => includes(cmdLike, cmd.aliases), cmds)

    if (foundCmd) {
      return {
        cmd: foundCmd.name,
        handler: foundCmd.handler,
        msg: {
          authorId,
          channelId,
          content: join(" ", drop(1, msgArgs))
        },
        error: null
      }
    } else {
      return {
        cmd: null,
        handler: null,
        msg: null,
        error: `Could not find command ${cmdLike}`
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
