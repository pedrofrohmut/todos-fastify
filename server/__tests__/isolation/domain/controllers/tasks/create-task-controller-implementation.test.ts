import { AdaptedRequest } from "../../../../../src/domain/types/router.types"
import { CreateTaskBody } from "../../../../../src/domain/types/request/body.types"

import CreateTaskController from "../../../../../src/domain/controllers/tasks/create-task-controller.interface"

import CreateTaskControllerImplementation from "../../../../../src/domain/controllers/tasks/implementations/create-task.controller"

import {
  expectsControllerResponse201,
  expectsControllerResponse400AndMessage,
  expectsControllerResponse401AndMessage,
  expectsToHaveError
} from "../../../../utils/functions/expects.functions"
import FakeUserService from "../../../../utils/fakes/user-service.fake"
import { isValidUUIDv4 } from "../../../../utils/functions/validation.functions"
import {
  MockCreateTaskUseCasePlaceholder,
  MockCreateTaskUseCaseThrowsUserNotFound
} from "../../../../utils/mocks/domain/usecases/tasks/create-task-usecase.mock"
import { getError } from "../../../../utils/functions/error.functions"
import UserNotFoundByIdError from "../../../../../src/domain/errors/users/user-not-found-by-id.error"
import { MockTaskValidator } from "../../../../utils/mocks/domain/validators/task-validator.mock"
import { MockUserValidator } from "../../../../utils/mocks/domain/validators/user-validator.mock"

const expectsValidController = (controller: any): void => {
  expect(controller).toBeTruthy()
  expect(controller).toBeObject()
  expect(controller).toBeInstanceOf(CreateTaskControllerImplementation)
}

const expectsValidAdaptedRequest = (req: any): void => {
  expect(req).toBeTruthy()
  expect(req).toBeObject()
  expect(req.body).toBeTruthy()
  expect(req.body).toBeObject()
  expect(req.body.name).toBeTruthy()
  expect(req.body.name).toBeString()
  expect(req.authUserId).toBeTruthy()
  expect(req.authUserId).toBeString()
  expect(isValidUUIDv4(req.authUserId)).toBeTrue()
  expect(req.params).toBeNull()
}

const taskValidator = new MockTaskValidator()
const userValidator = new MockUserValidator()
const createTaskUseCase = new MockCreateTaskUseCasePlaceholder()
const userId = FakeUserService.getValidUserId()

let adaptedRequest: AdaptedRequest<CreateTaskBody>
let controller: CreateTaskController

beforeEach(() => {
  adaptedRequest = {
    body: { name: "TaskName" },
    authUserId: userId,
    params: null
  }
  controller = new CreateTaskControllerImplementation(
    taskValidator,
    userValidator,
    createTaskUseCase
  )
})

describe("CreateTaskControllerImplementation | Execute | Validate request body", () => {
  test("Null body => 400/message", async () => {
    adaptedRequest.body = null
    // Given
    expect(adaptedRequest.body).toBeNull()
    expectsValidController(controller)
    // When
    const controllerResponse = await controller.execute(adaptedRequest)
    // Then
    expectsControllerResponse400AndMessage(controllerResponse)
  })

  test("Falsy name => 400/message", async () => {
    adaptedRequest.body = { name: undefined }
    // Given
    expect(adaptedRequest.body.name).toBeFalsy()
    expectsValidController(controller)
    // When
    const controllerResponse = await controller.execute(adaptedRequest)
    // Then
    expectsControllerResponse400AndMessage(controllerResponse)
  })

  test("Invalid name => 400/message", async () => {
    // @ts-ignore
    adaptedRequest.body = { name: 123 }
    // Given
    expect(adaptedRequest.body.name).toBeTruthy()
    expect(adaptedRequest.body.name).not.toBeString()
    expectsValidController(controller)
    // When
    const controllerResponse = await controller.execute(adaptedRequest)
    // Then
    expectsControllerResponse400AndMessage(controllerResponse)
  })
})

describe("CreateTaskControllerImplementation | Execute | Validate authUserId", () => {
  test("Null => 401/message", async () => {
    adaptedRequest.authUserId = null
    // Given
    expect(adaptedRequest.authUserId).toBeNull()
    expectsValidController(controller)
    // When
    const controllerResponse = await controller.execute(adaptedRequest)
    // Then
    expectsControllerResponse401AndMessage(controllerResponse)
  })

  test("Not a valid uuidv4 => 401/message", async () => {
    adaptedRequest.authUserId = "123"
    // Given
    expect(adaptedRequest.authUserId).toBeTruthy()
    expect(adaptedRequest.authUserId).toBeString()
    expect(isValidUUIDv4(adaptedRequest.authUserId)).toBeFalse()
    // When
    const controllerResponse = await controller.execute(adaptedRequest)
    // Then
    expectsControllerResponse401AndMessage(controllerResponse)
  })
})

describe("CreateTaskControllerImplementation | Execute | When useCase execute. Then return the right status/body", () => {
  test("UseCase execute with no error. Then => 201", async () => {
    const createTaskUseCase = new MockCreateTaskUseCasePlaceholder()
    const controller = new CreateTaskControllerImplementation(
      taskValidator,
      userValidator,
      createTaskUseCase
    )
    // @ts-ignore
    const useCaseErr = await getError(() => createTaskUseCase.execute())
    // Given
    expectsValidAdaptedRequest(adaptedRequest)
    expectsValidController(controller)
    expect(useCaseErr).toBeFalsy()
    // When
    const controllerResponse = await controller.execute(adaptedRequest)
    // Then
    expectsControllerResponse201(controllerResponse)
  })

  test("UseCase throws UserNotFoundError. Then => 400/message", async () => {
    const createTaskUseCase = new MockCreateTaskUseCaseThrowsUserNotFound()
    const controller = new CreateTaskControllerImplementation(
      taskValidator,
      userValidator,
      createTaskUseCase
    )
    // @ts-ignore
    const useCaseErr = await getError(() => createTaskUseCase.execute())
    // Given
    expectsValidAdaptedRequest(adaptedRequest)
    expectsValidController(controller)
    expectsToHaveError(useCaseErr)
    expect(useCaseErr).toBeInstanceOf(UserNotFoundByIdError)
    // When
    const controllerResponse = await controller.execute(adaptedRequest)
    // Then
    expectsControllerResponse400AndMessage(controllerResponse)
  })
})
