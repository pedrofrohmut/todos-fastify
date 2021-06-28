import "jest-extended"

import UserValidatorImplementation from "../../../../src/domain/validators/implementations/user.validator"

import { expectsTruthyMessage } from "../../../utils/functions/expects.functions"

const userValidator = new UserValidatorImplementation()

describe("UserValidatorImplementation | getMessageForId", () => {
  test("Null => message", () => {
    expectsTruthyMessage(userValidator.getMessageForId(null))
  })

  test("Undefined => message", () => {
    expectsTruthyMessage(userValidator.getMessageForId(undefined))
  })

  test("Not string => message", () => {
    // @ts-ignore
    expectsTruthyMessage(userValidator.getMessageForId(123))
  })

  test("Not uuid => message", () => {
    expectsTruthyMessage(userValidator.getMessageForId("hello world"))
  })

  test("Valid => null", () => {
    expect(userValidator.getMessageForId("f0347e73-0b11-499f-9b86-74b0a776455e"))
  })
})

describe("UserValidatorImplementation | getMessageForName", () => {
  test("Null  => message", () => {
    expectsTruthyMessage(userValidator.getMessageForName(null))
  })

  test("Undefined => message", () => {
    expectsTruthyMessage(userValidator.getMessageForName(undefined))
  })

  test("Not typeof string => message", () => {
    // @ts-ignore
    expectsTruthyMessage(userValidator.getMessageForName(123))
  })

  test("Too short (length < 3) => message", () => {
    expectsTruthyMessage(userValidator.getMessageForName("a"))
  })

  test("Too long (length > 120) => message", () => {
    expectsTruthyMessage(
      userValidator.getMessageForName(
        "Dolor dolores repudiandae molestiae totam et veritatis? Neque dolorum amet aliquam error deleniti Harum magni sunt hic nam adipisci Mollitia aliquid assumenda mollitia suscipit aliquam Officiis vitae et ut dignissimos aliquid ea. Qui harum reprehenderit enim exercitationem assumenda labore impedit inventore doloremque? Magnam eos eum aliquid laboriosam facere Enim necessitatibus"
      )
    )
  })

  test("Valid => null", () => {
    expect(userValidator.getMessageForName("John Doe")).toBeNull()
  })
})

describe("UserValidatorImplementation | getMessageForEmail", () => {
  test("Null => message", () => {
    expectsTruthyMessage(userValidator.getMessageForEmail(null))
  })

  test("Undefined => message", () => {
    expectsTruthyMessage(userValidator.getMessageForEmail(undefined))
  })

  test("Not typeof string => message", () => {
    // @ts-ignore
    expectsTruthyMessage(userValidator.getMessageForEmail(123))
  })

  test("Not a valid email regex match => message", () => {
    expectsTruthyMessage(userValidator.getMessageForEmail("i m not a valid email"))
  })

  test("Valid => null", () => {
    expect(userValidator.getMessageForEmail("user@mail.com")).toBeNull()
  })
})

describe("UserValidatorImplementation | getMessageForPassword", () => {
  test("Null => message", () => {
    expectsTruthyMessage(userValidator.getMessageForPassword(null))
  })

  test("Undefined => message", () => {
    expectsTruthyMessage(userValidator.getMessageForPassword(undefined))
  })

  test("Not typeof string => message", () => {
    // @ts-ignore
    expectsTruthyMessage(userValidator.getMessageForPassword(123))
  })

  test("Too short (length < 3) => message", () => {
    expectsTruthyMessage(userValidator.getMessageForPassword("ab"))
  })

  test("Too long (length > 32) => message", () => {
    expectsTruthyMessage(
      userValidator.getMessageForPassword("Elitsapientevoluptatemquoddictaashdia")
    )
  })

  test("Valid => null", () => {
    expect(userValidator.getMessageForPassword("123")).toBeNull()
  })
})
