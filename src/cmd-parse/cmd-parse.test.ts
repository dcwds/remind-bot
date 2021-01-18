import { cmdChar, cmdDict } from "../config"
import cmdParse from "./cmd-parse"

describe("cmdParse", () => {
  let mockParse: Function

  beforeEach(() => {
    mockParse = cmdParse(cmdChar, cmdDict)
  })

  it("parses successfully when using a valid command", () => {
    expect(mockParse("!remind 4d this is a test")).toEqual({
      cmd: "remind",
      handler: cmdDict["remind"].handler,
      deps: cmdDict["remind"].deps,
      msg: "4d this is a test",
      error: null
    })
  })

  it("parses successfully when using a valid command alias", () => {
    expect(mockParse("!r 4d this is a test")).toEqual({
      cmd: "remind",
      handler: cmdDict["remind"].handler,
      deps: cmdDict["remind"].deps,
      msg: "4d this is a test",
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
