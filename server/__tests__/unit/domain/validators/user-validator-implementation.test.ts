import "jest-extended"

import UserValidatorImplementation from "../../../../src/domain/validators/implementations/user.validator"

import { isValidUUIDv4 } from "../../../utils/functions/validation.functions"

const getValidationMessageForId = (id?: any) => {
  return new UserValidatorImplementation().getMessageForId(id)
}

const expectsInvalidId = (validationMessage?: string | null) => {
  expect(validationMessage).toBeTruthy()
  expect(validationMessage).toBeString()
}

describe("UserValidator | GetMessageForId", () => {
  test("Null => message", () => {
    const id = null
    // Given
    expect(id).toBeNull()
    // When
    const validationMessage = getValidationMessageForId(id)
    // Then
    expectsInvalidId(validationMessage)
  })

  test("Undefined => message", () => {
    const id = undefined
    // Given
    expect(id).toBeUndefined()
    // When
    const validationMessage = getValidationMessageForId(id)
    // Then
    expectsInvalidId(validationMessage)
  })

  test("Not string => message", () => {
    const id = 123
    // Given
    expect(id).not.toBeString()
    // When
    const validationMessage = getValidationMessageForId(id)
    // Then
    expectsInvalidId(validationMessage)
  })

  test("Not uuid => message", () => {
    const id = "userId"
    // Given
    expect(isValidUUIDv4(id)).toBeFalse()
    // When
    const validationMessage = getValidationMessageForId(id)
    // Then
    expectsInvalidId(validationMessage)
  })

  test("Valid => null", () => {
    const id = "f0347e73-0b11-499f-9b86-74b0a776455e"
    // Given
    expect(id).not.toBeNull()
    expect(id).toBeDefined()
    expect(id).toBeString()
    expect(isValidUUIDv4(id)).toBeTrue()
    // When
    const validationMessage = getValidationMessageForId(id)
    // Then
    expect(validationMessage).toBeNull()
  })
})