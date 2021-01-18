import { cmdChar, cmdDict } from "../config"
import cmdParse from "./cmd-parse"

describe("cmdParse", () => {
  let mockParse: Function

  beforeEach(() => {
    mockParse = cmdParse(cmdChar, cmdDict)
  })

  it("parses successfully when a valid command is used", () => {
    expect(mockParse("!remind this is a test")).toEqual({
      cmd: "remind",
      cmdHandler: cmdDict["remind"],
      parsedMsg: "this is a test",
      error: null
    })
  })

  it("parses with an error when an invalid command is used", () => {
    expect(mockParse("!badcommand this is a test").error).toBeTruthy()
  })

  it("parses with an error when no command is used", () => {
    expect(mockParse("this is a test").error).toBeTruthy()
  })
})
