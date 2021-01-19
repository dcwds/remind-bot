import { getUnixTime, add } from "date-fns/fp"
import { getReminder, timeDict } from "./remind"
import { Reminder } from "../../types"

describe("command handler: remind", () => {
  let now: Date
  const mockReminders: Reminder[] = []

  beforeEach(() => {
    now = new Date()
  })

  it("creates a reminder from valid input", () => {
    expect(
      getReminder(
        {
          authorId: "someid",
          channelId: "someid",
          content: "4d this is a test"
        },
        { getUnixTime, add },
        mockReminders,
        timeDict
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
        { getUnixTime, add },
        mockReminders,
        timeDict
      )
    ).toBeFalsy()
  })
})
