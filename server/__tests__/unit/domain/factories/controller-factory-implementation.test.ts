import "jest-extended"

import { Client } from "pg"

import CreateTaskControllerImplementation from "../../../../src/domain/controllers/tasks/implementations/create-task.controller"
import CreateUserControllerImplementation from "../../../../src/domain/controllers/users/implementations/create-user.controller"
import PostgresDatabaseConnection from "../../../../src/domain/database/implementations/postgres.database-connection"
import ControllerFactoryImplementation from "../../../../src/domain/factories/implementations/controller.factory"

import { getSyncError } from "../../../utils/functions/error.functions"
import { expectsToHaveError } from "../../../utils/functions/expects.functions"
import MockController from "../../../utils/mocks/domain/controllers/controller.mock"
import MockConnection from "../../../utils/mocks/domain/database/database-connection.mock"

const controllerFactory = new ControllerFactoryImplementation()
const connection = MockConnection()
const controller = MockController()

describe("ControllerFactoryImplementation | GetController | invalid args", () => {
  test("Null controller throws error", () => {
    const controller = null
    // Given
    expect(controller).toBeNull()
    // When
    const getControllerErr = getSyncError(() =>
      controllerFactory.getController(controller, connection)
    )
    // Then
    expectsToHaveError(getControllerErr)
  })

  test("Undefined controller throws error", () => {
    const controller = undefined
    // Given
    expect(controller).toBeUndefined()
    // When
    const getControllerErr = getSyncError(() =>
      controllerFactory.getController(controller, connection)
    )
    // Then
    expectsToHaveError(getControllerErr)
  })

  test("Not typeof function or object controller throws error", () => {
    const controller = 123
    // Given
    expect(controller).not.toBeFunction()
    expect(controller).not.toBeObject()
    // When
    const getControllerErr = getSyncError(() =>
      // @ts-ignore
      controllerFactory.getController(controller, connection)
    )
    // Then
    expectsToHaveError(getControllerErr)
  })

  test("Does not match any of the controllers listed throw error", () => {
    // Given
    expect(controller).toBeDefined()
    expect(controller).not.toBeNull()
    expect(controller).toBeObject()
    // When
    const getControllerErr = getSyncError(() =>
      controllerFactory.getController(controller, connection)
    )
    // Then
    expectsToHaveError(getControllerErr)
  })

  test("Null connection throw error", () => {
    const connection = null
    // Given
    expect(connection).toBeNull()
    // When
    const getControllerErr = getSyncError(() =>
      controllerFactory.getController(controller, connection)
    )
    // Then
    expectsToHaveError(getControllerErr)
  })

  test("Undefined connection throw error", () => {
    const connection = undefined
    // Given
    expect(connection).toBeUndefined()
    // When
    const getControllerErr = getSyncError(() =>
      controllerFactory.getController(controller, connection)
    )
    // Then
    expectsToHaveError(getControllerErr)
  })

  test("Not typeof object throw error", () => {
    const connection = 123
    // Given
    expect(connection).not.toBeObject()
    // When
    const getControllerErr = getSyncError(() =>
      // @ts-ignore
      controllerFactory.getController(controller, connection)
    )
    // Then
    expectsToHaveError(getControllerErr)
  })
})

describe("ControllerFactoryImplementation | GetController | listed controller passed as Function returns the right instance", () => {
  test("CreateTaskImplementation => ready to use CreateTaskImplementation", () => {
    const arg = CreateTaskControllerImplementation
    const connection = new PostgresDatabaseConnection(new Client())
    // Given
    expect(arg).toBeTruthy()
    expect(arg.toString()).toEqual(CreateTaskControllerImplementation.toString())
    // When
    const controller = new ControllerFactoryImplementation().getController(
      CreateTaskControllerImplementation,
      connection
    )
    // Then
    expect(controller).toBeTruthy()
    expect(controller).toBeInstanceOf(CreateTaskControllerImplementation)
  })

  test("CreateUserImplementation => ready to use CreateUserImplementation", () => {
    const arg = CreateUserControllerImplementation
    const connection = new PostgresDatabaseConnection(new Client())
    // Given
    expect(arg).toBeTruthy()
    expect(arg.toString()).toEqual(CreateUserControllerImplementation.toString())
    // When
    const controller = new ControllerFactoryImplementation().getController(
      CreateUserControllerImplementation,
      connection
    )
    // Then
    expect(controller).toBeTruthy()
    expect(controller).toBeInstanceOf(CreateUserControllerImplementation)
  })
})
