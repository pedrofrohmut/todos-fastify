import "jest-extended"

import ControllerFactoryImplementation from "../../../../src/domain/factories/implementations/controller.factory"

import { MockControllerNotListed } from "../../../utils/mocks/controller.mock"

const getGetControllerError = (controller: any): null | Error => {
  try {
    new ControllerFactoryImplementation().getController(controller)
    return null
  } catch (err) {
    return err
  }
}

const expectsToHaveError = (err: any) => {
  expect(err).toBeDefined()
  expect(err).not.toBeNull()
  expect(err.message).toBeTruthy()
  expect(err.message).toBeString()
}

describe("ControllerFactoryImplementation | GetController | invalid args", () => {
  test("Null arg throws error", () => {
    const controller = null
    // Given
    expect(controller).toBeNull()
    // When
    const getControllerErr = getGetControllerError(controller)
    // Then
    expectsToHaveError(getControllerErr)
  })

  test("Undefined arg throws error", () => {
    const controller = undefined
    // Given
    expect(controller).toBeUndefined()
    // When
    const getControllerErr = getGetControllerError(controller)
    // Then
    expectsToHaveError(getControllerErr)
  })

  test("Not typeof function or object throws error", () => {
    const controller = 123
    // Given
    expect(controller).not.toBeFunction()
    expect(controller).not.toBeObject()
    // When
    const getControllerErr = getGetControllerError(controller)
    // Then
    expectsToHaveError(getControllerErr)
  })

  test("Does not match any of the controllers listed throws error", () => {
    const controller = new MockControllerNotListed()
    // Given
    expect(controller).toBeDefined()
    expect(controller).not.toBeNull()
    expect(controller).toBeObject()

    // When
    const getControllerErr = getGetControllerError(controller)
    // Then
    expectsToHaveError(getControllerErr)
  })
})

describe("ControllerFactoryImplementation | GetController | listed controller", () => {})
