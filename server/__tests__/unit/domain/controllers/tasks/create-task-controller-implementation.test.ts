import { CreateTaskBody } from "../../../../../src/domain/types/request/body.types"
import { AdaptedRequest } from "../../../../../src/domain/types/router.types"

import CreateTaskController from "../../../../../src/domain/controllers/tasks/create-task-controller.interface"

import TaskValidatorImplementation from "../../../../../src/domain/validators/implementations/task.validator"
import UserValidatorImplementation from "../../../../../src/domain/validators/implementations/user.validator"
import PostgresFindUserByIdService from "../../../../../src/domain/services/users/implementations/postgres-find-user-by-id.service"
import PostgresCreateTaskService from "../../../../../src/domain/services/tasks/implementations/postgres-create-task.service"
import CreateTaskUseCaseImplementation from "../../../../../src/domain/usecases/tasks/implementations/create-task.usecase"
import CreateTaskControllerImplementation from "../../../../../src/domain/controllers/tasks/implementations/create-task.controller"

import UserNotFoundByIdError from "../../../../../src/domain/errors/users/user-not-found-by-id.error"

import FakeUserService from "../../../../utils/fakes/user-service.fake"
import { getError } from "../../../../utils/functions/error.functions"
import {
  expectsControllerResponse201,
  expectsControllerResponse400AndMessage,
  expectsControllerResponse401AndMessage,
  expectsToHaveError
} from "../../../../utils/functions/expects.functions"
import MockConnection, {
  MockConnectionAcceptQuery
} from "../../../../utils/mocks/domain/database/database-connection.mock"

const connection = MockConnection()

const userId = FakeUserService.getValidUserId()
const taskValidator = new TaskValidatorImplementation()
const userValidator = new UserValidatorImplementation()
const findUserByIdService = new PostgresFindUserByIdService(connection)
const createTaskService = new PostgresCreateTaskService(connection)
const createTaskUseCase = new CreateTaskUseCaseImplementation(
  findUserByIdService,
  createTaskService
)

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
    // When
    const controllerResponse = await controller.execute(adaptedRequest)
    // Then
    expectsControllerResponse400AndMessage(controllerResponse)
  })

  test("Falsy name => 400/message", async () => {
    adaptedRequest.body = { name: undefined }
    // Given
    expect(adaptedRequest.body.name).toBeFalsy()
    // When
    const controllerResponse = await controller.execute(adaptedRequest)
    // Then
    expectsControllerResponse400AndMessage(controllerResponse)
  })

  test("Not type of string name => 400/message", async () => {
    // @ts-ignore
    adaptedRequest.body = { name: 123 }
    // Given
    expect(adaptedRequest.body.name).toBeTruthy()
    expect(adaptedRequest.body.name).not.toBeString()
    // When
    const controllerResponse = await controller.execute(adaptedRequest)
    // Then
    expectsControllerResponse400AndMessage(controllerResponse)
  })
})

describe("CreateTaskControllerImplementation | Execute | Validate authUserId", () => {
  test("Null authUserId => 401/message", async () => {
    adaptedRequest.authUserId = null
    // Given
    expect(adaptedRequest.authUserId).toBeNull()
    // When
    const controllerResponse = await controller.execute(adaptedRequest)
    // Then
    expectsControllerResponse401AndMessage(controllerResponse)
  })

  test("Not valid authUserId => 401/message", async () => {
    adaptedRequest.authUserId = "123"
    const authUserIdvalidationMessage = userValidator.getMessageForId(adaptedRequest.authUserId)
    // Given
    expect(authUserIdvalidationMessage).toBeTruthy()
    // When
    const controllerResponse = await controller.execute(adaptedRequest)
    // Then
    expectsControllerResponse401AndMessage(controllerResponse)
  })
})

describe("CreateTaskControllerImplementation | Execute | When useCase execute", () => {
  test("UseCase executes with no errors", async () => {
    const mockQuery = jest.fn(() => [
      {
        id: "user_id",
        name: "User Name",
        email: "user@mail.com",
        password_hash: "user_hash"
      }
    ])
    const connection = MockConnectionAcceptQuery(mockQuery)()
    const findUserByIdService = new PostgresFindUserByIdService(connection)
    const createTaskUseCase = new CreateTaskUseCaseImplementation(
      findUserByIdService,
      createTaskService
    )
    const controller = new CreateTaskControllerImplementation(
      taskValidator,
      userValidator,
      createTaskUseCase
    )
    const useCaseErr = await getError(() =>
      createTaskUseCase.execute(adaptedRequest.body, adaptedRequest.authUserId)
    )
    // Given
    expect(useCaseErr).toBeFalsy()
    // When
    const controllerResponse = await controller.execute(adaptedRequest)
    // Then
    expectsControllerResponse201(controllerResponse)
  })

  test("UseCase throws UserNotFoundError. Then => 400/message", async () => {
    const mockQuery = jest.fn(() => [])
    const connection = MockConnectionAcceptQuery(mockQuery)()
    const findUserByIdService = new PostgresFindUserByIdService(connection)
    const createTaskUseCase = new CreateTaskUseCaseImplementation(
      findUserByIdService,
      createTaskService
    )
    const controller = new CreateTaskControllerImplementation(
      taskValidator,
      userValidator,
      createTaskUseCase
    )
    const useCaseErr = await getError(() => createTaskUseCase.execute(adaptedRequest.body, userId))
    // Given
    expectsToHaveError(useCaseErr)
    expect(useCaseErr).toBeInstanceOf(UserNotFoundByIdError)
    // When
    const controllerResponse = await controller.execute(adaptedRequest)
    // Then
    expectsControllerResponse400AndMessage(controllerResponse)
    expect(controllerResponse.body).toContain(UserNotFoundByIdError.message)
  })
})
