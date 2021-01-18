import cmdParse from "./cmd-parse"
import { cmdChar, cmdDict } from "./config"

console.log(cmdParse(cmdChar, cmdDict, "!remind this is a test"))
