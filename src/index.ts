import cmdParse from "./cmd-parse"
import { cmdChar, cmdDict } from "./config"

const { cmdHandler, parsedMsg } = cmdParse(
  cmdChar,
  cmdDict,
  "!remind 40min this is a test"
)

console.log(cmdHandler(parsedMsg))
