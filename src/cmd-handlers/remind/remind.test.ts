import { DateTime } from "luxon"
import { getReminder, timeDict } from "./remind"
import { Reminder } from "../../types"

describe("command handler: remind", () => {
  let now: DateTime
  const mockReminders: Reminder[] = []

  beforeEach(() => {
    now = DateTime.local()
  })

  it("creates a reminder from valid input", () => {
    expect(
      getReminder("4d this is a test", now, mockReminders, timeDict)
    ).toEqual({
      id: 0,
      text: "this is a test",
      createdAt: now.toMillis(),
      remindAt: now.plus({ days: 4 }).toMillis()
    })
  })

  it("doesn't create a reminder from invalid input", () => {
    expect(
      getReminder("invalid input", now, mockReminders, timeDict)
    ).toBeFalsy()
  })
})
