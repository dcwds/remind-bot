import { cmdDict } from "../../config"
import { getReminder } from "./remind"
import { Reminder } from "../../types"

describe("command handler: remind", () => {
  let now: Date
  const {
    remind: { deps }
  } = cmdDict

  beforeEach(() => {
    now = new Date()
  })

  it("creates a reminder from valid input", () => {
    const { add, getUnixTime } = deps.dateFns

    expect(
      getReminder(
        {
          authorId: "someid",
          channelId: "someid",
          content: "4d this is a test"
        },
        { ...deps, getReminders: () => [] }
      )
    ).toEqual({
      id: 0,
      message: {
        authorId: "someid",
        channelId: "someid",
        content: "this is a test"
      },
      createdAt: getUnixTime(now),
      remindAt: getUnixTime(add({ days: 4 }, now)),
      hasReminded: false
    })
  })

  it("doesn't create a reminder from invalid input", () => {
    expect(
      getReminder(
        {
          authorId: "someid",
          channelId: "someid",
          content: "invalid input"
        },
        { ...deps, getReminders: () => [] }
      )
    ).toBeFalsy()
  })
})
