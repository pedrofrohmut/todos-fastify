import "jest-extended"

import { Controller } from "../../../../src/domain/types/router.types"

import DatabaseConnection from "../../../../src/domain/database/database-connection.interface"

import ControllerFactoryImplementation from "../../../../src/domain/factories/implementations/controller.factory"
import CreateTaskControllerImplementation from "../../../../src/domain/controllers/tasks/implementations/create-task.controller"

import {
  MockControllerPlaceholder
} from "../../../utils/mocks/domain/controllers/controller.mock"
import { expectsToHaveError } from "../../../utils/functions/expects.functions"
import { getSyncError } from "../../../utils/functions/error.functions"
import PostgresDatabaseConnection from "../../../../src/domain/database/implementations/postgres.database-connection"
import {Client} from "pg"

const expectsValidController = (c: any): void => {
  expect(c).toBeTruthy()
  expect(c).toBeObject()
  expect(c.execute).toBeDefined()
}

const MockConnection = jest.fn().mockImplementation(() => {
  return {}
})

const getGetControllerError = (controller: any, connection: any) => {
  const possibleErr = getSyncError(() => {
    new ControllerFactoryImplementation().getController(controller, connection)
  })
  return possibleErr
}

let controller: Controller<any, any>
let connection: DatabaseConnection

beforeEach(() => {
  controller = new MockControllerPlaceholder()
  connection = new MockConnection()
})

describe("ControllerFactoryImplementation | GetController | invalid args", () => {
  test("Null controller throws error", () => {
    const controller = null
    // Given
    expect(controller).toBeNull()
    // When
    const getControllerErr = getGetControllerError(controller, connection)
    // Then
    expectsToHaveError(getControllerErr)
  })

  test("Undefined controller throws error", () => {
    const controller = undefined
    // Given
    expect(controller).toBeUndefined()
    // When
    const getControllerErr = getGetControllerError(controller, connection)
    // Then
    expectsToHaveError(getControllerErr)
  })

  test("Not typeof function or object controller throws error", () => {
    const controller = 123
    // Given
    expect(controller).not.toBeFunction()
    expect(controller).not.toBeObject()
    // When
    const getControllerErr = getGetControllerError(controller, connection)
    // Then
    expectsToHaveError(getControllerErr)
  })

  test("Does not match any of the controllers listed throw error", () => {
    const controller = jest.fn().mockImplementation(() => ({
      execute: jest.fn()
    }))()
    // Given
    expect(controller).toBeDefined()
    expect(controller).not.toBeNull()
    expect(controller).toBeObject()
    // When
    const getControllerErr = getGetControllerError(controller, connection)
    // Then
    expectsToHaveError(getControllerErr)
  })

  test("Null connection throw error", () => {
    const connection = null
    // Given
    expectsValidController(controller)
    expect(connection).toBeNull()
    // When
    const getControllerErr = getGetControllerError(controller, connection)
    // Then
    expectsToHaveError(getControllerErr)
  })

  test("Undefined connection throw error", () => {
    const connection = undefined
    // Given
    expectsValidController(controller)
    expect(connection).toBeUndefined()
    // When
    const getControllerErr = getGetControllerError(controller, connection)
    // Then
    expectsToHaveError(getControllerErr)
  })

  test("Not typeof object throw error", () => {
    const connection = 123
    // Given
    expectsValidController(controller)
    expect(connection).not.toBeObject()
    // When
    const getControllerErr = getGetControllerError(controller, connection)
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
})
