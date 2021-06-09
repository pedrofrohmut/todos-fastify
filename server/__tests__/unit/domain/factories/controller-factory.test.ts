import "jest-extended"

import CreateTaskControllerImplementation from "../../../../src/domain/controllers/tasks/implementations/create-task.controller"
import ControllerFactory from "../../../../src/domain/factories/controller.factory"
import { AdaptedRequest } from "../../../../src/utils/types/controller/util.types"

describe("ControllerFactory | GetController", () => {
  test("with null args throws error", () => {
    const controllerArg = null
    // Given
    expect(controllerArg).toBeNull()
    // Then
    let getterErr: Error = undefined
    try {
      ControllerFactory.getController(controllerArg)
    } catch (err) {
      getterErr = err
    }
    // When
    expect(getterErr).toBeDefined()
    expect(getterErr.message).toBeTruthy()
  })

  test("with undefined args throws error", () => {
    const controllerArg = undefined
    // Given
    expect(controllerArg).not.toBeDefined()
    // Then
    let getterErr: Error = undefined
    try {
      ControllerFactory.getController(controllerArg)
    } catch (err) {
      getterErr = err
    }
    // When
    expect(getterErr).toBeDefined()
    expect(getterErr.message).toBeTruthy()
  })

  test("With a valid but not listed controller throws error", () => {
    class NonExistentControllerImplementation {
      public async execute(_: AdaptedRequest) {}
    }
    const controllerProps = Object.getOwnPropertyNames(
      NonExistentControllerImplementation.prototype
    )
    // Given
    expect(controllerProps).toContain("execute")
    // When
    let getterErr: Error = undefined
    try {
      ControllerFactory.getController(NonExistentControllerImplementation)
    } catch (err) {
      getterErr = err
    }
    // Then
    expect(getterErr).toBeDefined()
    expect(getterErr.message).toBeTruthy()
  })

  test("With a valid and listed controller returns a ready instance", () => {
    let getterErr: Error = undefined
    try {
      ControllerFactory.getController(CreateTaskControllerImplementation)
    } catch (err) {
      getterErr = err
    }
    // Given
    expect(getterErr).not.toBeDefined()
    // When
    const controllerInstance = ControllerFactory.getController(CreateTaskControllerImplementation)
    // Then
    expect(controllerInstance).toBeTruthy()
    expect(controllerInstance instanceof CreateTaskControllerImplementation).toBeTrue()
  })
})
