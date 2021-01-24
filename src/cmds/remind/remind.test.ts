import { add, getUnixTime } from "date-fns/fp"
import prepareReminder from "./remind-prepare"

describe("command: remind", () => {
  let now: Date

  beforeEach(() => {
    now = new Date()
  })

  it("creates a reminder from valid input", () => {
    expect(
      prepareReminder(
        {
          authorId: "someid",
          channelId: "someid",
          content: "4d this is a test"
        },
        []
      )
    ).toEqual({
      id: 0,
      message: {
        authorId: "someid",
        channelId: "someid"
      },
      createdAt: getUnixTime(now),
      remindAt: getUnixTime(add({ days: 4 }, now)),
      text: "this is a test"
    })
  })

  it("doesn't create a reminder from invalid input", () => {
    expect(
      prepareReminder(
        {
          authorId: "someid",
          channelId: "someid",
          content: "invalid input"
        },
        []
      )
    ).toBeFalsy()
  })
})
