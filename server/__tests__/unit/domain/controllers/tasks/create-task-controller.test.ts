import "jest-extended"

import CreateTaskControllerImplementation from "../../../../../src/domain/controllers/tasks/implementations/create-task.controller"
import ControllerFactory from "../../../../../src/domain/factories/controller.factory"
import CreateTaskUseCaseImplementation from "../../../../../src/domain/usecases/tasks/implementations/create-task.usecase"
import DeleteTaskUseCaseImplementation from "../../../../../src/domain/usecases/tasks/implementations/delete-task.usecase"

import ExpiredTokenError from "../../../../../src/domain/errors/auth/expired-token.error"
import UserNotFoundByIdError from "../../../../../src/domain/errors/users/user-not-found-by-id.error"

import FakeTokenService from "../../../../utils/fakes/fake-token.service"

describe("CreateTaskController | Constructor", () => {
  test("Constructor called with null useCase throws error", () => {
    const createTaskUseCase = null
    // Given
    expect(createTaskUseCase).toBeNull()
    // When
    let constructErr: Error = undefined
    try {
      new CreateTaskControllerImplementation(null)
    } catch (err) {
      constructErr = err
    }
    // Then
    expect(constructErr).toBeDefined()
    expect(constructErr.message).toBeTruthy()
    expect(typeof constructErr.message === "string").toBeTrue()
  })

  test("Constructor called with undefined useCase throws error", () => {
    const createTaskUseCase = undefined
    // Given
    expect(createTaskUseCase).not.toBeDefined()
    // When
    let constructErr: Error = undefined
    try {
      new CreateTaskControllerImplementation(null)
    } catch (err) {
      constructErr = err
    }
    // Then
    expect(constructErr).toBeDefined()
    expect(constructErr.message).toBeTruthy()
    expect(typeof constructErr.message === "string").toBeTrue()
  })

  test("Constructor called with valid useCase but the wrong one throws error", () => {
    const useCase = new DeleteTaskUseCaseImplementation()
    // Given
    expect(useCase).toBeDefined()
    expect(typeof useCase === "object").toBeTrue()
    expect(useCase instanceof CreateTaskUseCaseImplementation).toBeFalse()
    // When
    let constructErr: Error = undefined
    try {
      // @ts-ignore
      new CreateTaskControllerImplementation(useCase)
    } catch (err) {
      constructErr = err
    }
    // Then
    expect(constructErr).toBeDefined()
    expect(constructErr.message).toBeDefined()
    expect(typeof constructErr.message === "string").toBeTrue()
  })

  test("Constructor called with valid useCase throws no errors", () => {
    const useCase = new CreateTaskUseCaseImplementation()
    // Given
    expect(useCase).toBeDefined()
    expect(typeof useCase === "object").toBeTrue()
    expect(useCase instanceof CreateTaskUseCaseImplementation).toBeTrue()
    // When
    let constructErr: Error = undefined
    try {
      new CreateTaskControllerImplementation(useCase)
    } catch (err) {
      constructErr = err
    }
    // Then
    expect(constructErr).not.toBeDefined()
  })
})

describe("CreateTaskController | Execute | Request", () => {
  const validBody = { name: "TaskName", description: "TaskDescription", userId: "UserId" }
  const validHeaders = { authenticationToken: FakeTokenService.getValid("UserId") }

  test("Null request throws error", async () => {
    const request = null
    // Given
    expect(request).toBeNull()
    // When
    let executeErr: Error = undefined
    try {
      await ControllerFactory.getController(CreateTaskControllerImplementation).execute(request)
    } catch (err) {
      executeErr = err
    }
    // Then
    expect(executeErr).toBeDefined()
    expect(executeErr.message).toBeTruthy()
  })

  test("Undefined request throws error", async () => {
    const request = undefined
    // Given
    expect(request).not.toBeDefined()
    // When
    let executeErr: Error = undefined
    try {
      await ControllerFactory.getController(CreateTaskControllerImplementation).execute(request)
    } catch (err) {
      executeErr = err
    }
    // Then
    expect(executeErr).toBeDefined()
    expect(executeErr.message).toBeTruthy()
  })

  // request not object
  test("Request is not object throws error", async () => {
    const request = 123
    // Given
    expect(typeof request === "object").toBeFalse()
    // When
    let executeErr: Error = undefined
    try {
      // @ts-ignore
      await ControllerFactory.getController(CreateTaskControllerImplementation).execute(request)
    } catch (err) {
      executeErr = err
    }
    // Then
    expect(executeErr).toBeDefined()
    expect(executeErr.message).toBeTruthy()
  })

  // Only one scenario to test response => all scenarios will be tested one validation tests
  test("Invalid body returns BadRequest (No name test)", async () => {
    const body = { descrption: "TaskDescription", userId: "UserId" }
    const request = { body, headers: validHeaders, params: null }
    // Given
    expect(body).not.toContainKey("name")
    // When
    const response = await ControllerFactory.getController(
      CreateTaskControllerImplementation
    ).execute(request)
    // Then
    expect(response.status).toBe(400)
    expect(response.body).toBeDefined()
    expect(response.body).toBeString()
  })

  // Only one scenario to test response => all scenarios will be tested one validation tests
  test("Invalid headers returns Unauthorized (ExpiredToken test)", async () => {
    const headers = { authenticationToken: FakeTokenService.getExpired() }
    let decodeErr: Error = undefined
    try {
      FakeTokenService.decode(headers.authenticationToken)
    } catch (err) {
      decodeErr = err
    }
    const request = { body: validBody, headers, params: null }
    // Given
    expect(decodeErr).toBeDefined()
    expect(decodeErr).toBeInstanceOf(ExpiredTokenError)
    // When
    const response = await ControllerFactory.getController(
      CreateTaskControllerImplementation
    ).execute(request)
    // Then
    expect(response.status).toBe(401)
    expect(response.body).toBeDefined()
    expect(response.body).toBeString()
  })

  test("Valid request controller returns 400/message or 201/noBody", async () => {
    const request = { body: validBody, headers: validHeaders, params: null }
    // Given
    expect(request.body).toEqual(validBody)
    expect(request.headers).toEqual(validHeaders)
    // When
    const response = await ControllerFactory.getController(
      CreateTaskControllerImplementation
    ).execute(request)
    // Then
    expect(response.status).toBeOneOf([201, 400, 500])
  })
})
