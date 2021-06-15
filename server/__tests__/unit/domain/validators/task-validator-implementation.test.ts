import "jest-extended"

import TaskValidatorImplementation from "../../../../src/domain/validators/implementations/task.validator"

const getValidationMessageForName = (name?: any) => {
  return new TaskValidatorImplementation().getMessageForName(name)
}

const expectsInvalidName = (validationMessage: string | null) => {
  expect(validationMessage).toBeTruthy()
  expect(validationMessage).toBeString()
}

const getValidationMessageForDescription = (description?: any) => {
  return new TaskValidatorImplementation().getMessageForDescription(description)
}

const expectsInvalidDescription = (validationMessage: string | null) => {
  expect(validationMessage).toBeTruthy()
  expect(validationMessage).toBeString()
}

describe("TaskValidator | getMessageForName", () => {
  test("Null => message", () => {
    const name = null
    // Given
    expect(name).toBeNull()
    // When
    const validationMessage = getValidationMessageForName(name)
    // Then
    expectsInvalidName(validationMessage)
  })

  test("Undefined => message", () => {
    const name = undefined
    // Given
    expect(name).toBeUndefined()
    // When
    const validationMessage = getValidationMessageForName(name)
    // Then
    expectsInvalidName(validationMessage)
  })

  test("Not string => message", () => {
    const name = 123
    // Given
    expect(name).not.toBeString()
    // When
    const validationMessage = getValidationMessageForName(name)
    // Then
    expectsInvalidName(validationMessage)
  })

  test("Too short => message", () => {
    const name = "n"
    // Given
    expect(name.length).toBeLessThan(3)
    // When
    const validationMessage = getValidationMessageForName(name)
    // Then
    expectsInvalidName(validationMessage)
  })

  test("Too long => message", () => {
    const name =
      "Ipsum nostrum similique dolor aut veritatis? Corporis dolorem eos eos praesentium obcaecati. Ipsum ab eligendi non vitae Ipsum voluptate dolorem magni"
    // Given
    expect(name.length).toBeGreaterThan(120)
    // When
    const validationMessage = getValidationMessageForName(name)
    // Then
    expectsInvalidName(validationMessage)
  })

  test("Valid => null", () => {
    const name = "Task Name"
    // Give
    expect(name).toBeDefined()
    expect(name).not.toBeNull()
    expect(name).toBeString()
    expect(name.length).toBeGreaterThan(1)
    expect(name.length).toBeLessThan(121)
    // When
    const validationMessage = getValidationMessageForName(name)
    // Then
    expect(validationMessage).toBeNull()
  })
})

describe("TaskValidator | getMessageForDescription", () => {
  test("Too long => message", () => {
    const description =
      "Ipsum consequatur fugiat ducimus ea maxime? Earum reiciendis sed consectetur perspiciatis officia Quisquam maxime velit fugit consequatur molestiae Porro ducimus consequatur autem odit illum Recusandae nihil nemo minima assumenda ab Minima dolores debitis eius ipsum voluptatibus maiores, tempora? Ipsum asperiores nam neque doloremque sunt Ut ducimus eaque ex magnam maiores!"
    // Given
    expect(description.length).toBeGreaterThan(255)
    // When
    const validationMessage = getValidationMessageForDescription(description)
    // Then
    expectsInvalidDescription(validationMessage)
  })

  test("Not string => message", () => {
    const description = 123
    // Given
    expect(description).not.toBeString()
    // When
    const validationMessage = getValidationMessageForDescription(description)
    // Then
    expectsInvalidDescription(validationMessage)
  })

  test("Valid => null", () => {
    const description = "Task Description"
    // Given
    expect(description.length).toBeLessThan(255)
    expect(description).toBeString()
    // When
    const validationMessage = getValidationMessageForDescription(description)
    // Then
    expect(validationMessage).toBeNull()
  })
})
