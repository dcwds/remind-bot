import { cmdChar, cmdDict } from "../config"
import cmdParse from "./cmd-parse"

describe("cmdParse", () => {
  let mockParse: Function

  beforeEach(() => {
    mockParse = cmdParse(cmdChar, cmdDict)
  })

  it("parses successfully when using a valid command", () => {
    expect(
      mockParse({
        authorId: "someid",
        channelId: "someid",
        content: "!remind 4d this is a test"
      })
    ).toEqual({
      cmd: "remind",
      handler: cmdDict["remind"].handler,
      deps: cmdDict["remind"].deps,
      msg: {
        authorId: "someid",
        channelId: "someid",
        content: "4d this is a test"
      },
      error: null
    })
  })

  it("parses successfully when using a valid command alias", () => {
    expect(
      mockParse({
        authorId: "someid",
        channelId: "someid",
        content: "!r 4d this is a test"
      })
    ).toEqual({
      cmd: "remind",
      handler: cmdDict["remind"].handler,
      deps: cmdDict["remind"].deps,
      msg: {
        authorId: "someid",
        channelId: "someid",
        content: "4d this is a test"
      },
      error: null
    })
  })

  it("parses with an error when an invalid command is used", () => {
    expect(
      mockParse({
        authorId: "someid",
        channelId: "someid",
        content: "!badcommand this is a test"
      }).error
    ).toBeTruthy()
  })

  it("parses with an error when no command is used", () => {
    expect(
      mockParse({
        authorId: "someid",
        channelId: "someid",
        content: "this is a test"
      }).error
    ).toBeTruthy()
  })
})
