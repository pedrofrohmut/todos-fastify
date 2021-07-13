import { AdaptedRequest } from "../../../../../src/domain/types/router.types"

import TaskValidatorImplementation from "../../../../../src/domain/validators/implementations/task.validator"
import PostgresFindUserByIdService from "../../../../../src/domain/services/users/implementations/postgres-find-user-by-id.service"
import PostgresFindTaskByIdService from "../../../../../src/domain/services/tasks/implementations/postgres-find-task-by-id.service"
import PostgresClearCompleteTodosByTaskIdService from "../../../../../src/domain/services/todos/implementations/postgres-clear-complete-todos-by-task-id.service"
import ClearCompleteTodosByTaskIdUseCaseImplementation from "../../../../../src/domain/usecases/todos/implementations/clear-complete-todos-by-task-id.usecase"
import ClearCompleteTodosByTaskIdControllerImplementation from "../../../../../src/domain/controllers/todos/implementations/clear-complete-todos-by-task-id.controller"

import FakeTaskService from "../../../../utils/fakes/task-service.fake"
import FakeTokenService from "../../../../utils/fakes/token-service.fake"
import FakeUserService from "../../../../utils/fakes/user-service.fake"
import { MockConnectionAcceptQuery } from "../../../../utils/mocks/domain/database/database-connection.mock"
import {
  expectsControllerResponse204,
  expectsControllerResponse400AndMessage,
  expectsControllerResponse401AndMessage
} from "../../../../utils/functions/expects.functions"
import MissingRequestParamsError from "../../../../../src/domain/errors/controllers/missing-request-params.error"
import MissingRequestAuthTokenError from "../../../../../src/domain/errors/controllers/missing-request-auth-token.error"
import UserNotFoundByIdError from "../../../../../src/domain/errors/users/user-not-found-by-id.error"
import TaskNotFoundByIdError from "../../../../../src/domain/errors/tasks/task-not-found-by-id.error"

const userId = FakeUserService.getValidUserId()
const token = FakeTokenService.getValid(userId)
const authToken = FakeTokenService.decode(token)
const userDB = FakeUserService.getUserDB("1", userId)
const foundUserFromService = FakeUserService.getUserFromService(userDB)
const taskId = FakeTaskService.getValidTaskId()
const taskDB = FakeTaskService.getTaskDB("1", userId, taskId)
const foundTaskFromService = FakeTaskService.getTaskFromService(taskDB)
const taskValidator = new TaskValidatorImplementation()
const { clearCompleteTodosByTaskIdController } = buildController(jest.fn())

let request: AdaptedRequest<null>

beforeEach(() => {
  const adaptedRequest = Object.freeze({
    body: null,
    authToken,
    params: {
      taskId
    }
  })
  request = { ...adaptedRequest }
})

describe("ClearCompleteTodosByTaskIdControllerImplementation", () => {
  test("Null params => 400/message", async () => {
    request.params = null
    // Given
    expect(request.params).toBeNull()
    // When
    const controllerResponse = await clearCompleteTodosByTaskIdController.execute(request)
    // Then
    expectsControllerResponse400AndMessage(controllerResponse)
    expect(controllerResponse.body).toContain(MissingRequestParamsError.message)
  })

  test("Invalid params for taskId => 400/message", async () => {
    // @ts-ignore
    request.params.taskId = 123
    const taskIdValidationMessage = taskValidator.getMessageForId(request.params.taskId)
    // Given
    expect(taskIdValidationMessage).not.toBeNull()
    // When
    const controllerResponse = await clearCompleteTodosByTaskIdController.execute(request)
    // Then
    expectsControllerResponse400AndMessage(controllerResponse)
    expect(controllerResponse.body).toContain(taskIdValidationMessage)
  })

  test("Null authToken => 401/message", async () => {
    request.authToken = null
    // Given
    expect(request.authToken).toBeNull()
    // When
    const controllerResponse = await clearCompleteTodosByTaskIdController.execute(request)
    // Then
    expectsControllerResponse401AndMessage(controllerResponse)
    expect(controllerResponse.body).toContain(MissingRequestAuthTokenError.message)
  })

  test("Valid request. But user not found 400/message", async () => {
    const { connection, foundUser, clearCompleteTodosByTaskIdController } =
      await setupUserNotFound()
    // Given
    expectsValidRequest(request, userId, taskId)
    expect(connection.query).toHaveBeenCalledTimes(1)
    expect(foundUser).toBeNull()
    // When
    const controllerResponse = await clearCompleteTodosByTaskIdController.execute(request)
    // Then
    expect(connection.query).toHaveBeenCalledTimes(2)
    expect(connection.mutate).not.toHaveBeenCalled()
    expectsControllerResponse400AndMessage(controllerResponse)
    expect(controllerResponse.body).toContain(UserNotFoundByIdError.message)
  })

  test("Valid request and user found. But task not found 400/message", async () => {
    const { connection, foundUser, foundTask, clearCompleteTodosByTaskIdController } =
      await setupUserFoundButTaskNotFound()
    // Given
    expectsValidRequest(request, userId, taskId)
    expect(connection.query).toHaveBeenCalledTimes(2)
    expect(foundUser).toEqual(foundUserFromService)
    expect(foundTask).toBeNull()
    // When
    const controllerResponse = await clearCompleteTodosByTaskIdController.execute(request)
    // Then
    expect(connection.query).toHaveBeenCalledTimes(4)
    expect(connection.mutate).not.toHaveBeenCalled()
    expectsControllerResponse400AndMessage(controllerResponse)
    expect(controllerResponse.body).toContain(TaskNotFoundByIdError.message)
  })

  test("Valid request, user and task found => 204", async () => {
    const { connection, foundUser, foundTask, clearCompleteTodosByTaskIdController } =
      await setupUserAndTaskFound()
    // Given
    expectsValidRequest(request, userId, taskId)
    expect(connection.query).toHaveBeenCalledTimes(2)
    expect(foundUser).toEqual(foundUserFromService)
    expect(foundTask).toEqual(foundTaskFromService)
    // When
    const controllerResponse = await clearCompleteTodosByTaskIdController.execute(request)
    // Then
    expect(connection.query).toHaveBeenCalledTimes(4)
    expect(connection.mutate).toHaveBeenCalledTimes(1)
    expectsControllerResponse204(controllerResponse)
  })
})

function buildController(mockQuery: jest.Mock<any, any>) {
  const connection = MockConnectionAcceptQuery(mockQuery)()
  const findUserByIdService = new PostgresFindUserByIdService(connection)
  const findTaskByIdService = new PostgresFindTaskByIdService(connection)
  const clearCompleteTodosByTaskIdService = new PostgresClearCompleteTodosByTaskIdService(
    connection
  )
  const clearCompleteTodosByTaskIdUseCase = new ClearCompleteTodosByTaskIdUseCaseImplementation(
    findUserByIdService,
    findTaskByIdService,
    clearCompleteTodosByTaskIdService
  )
  const clearCompleteTodosByTaskIdController =
    new ClearCompleteTodosByTaskIdControllerImplementation(
      taskValidator,
      clearCompleteTodosByTaskIdUseCase
    )
  return {
    findUserByIdService,
    findTaskByIdService,
    connection,
    clearCompleteTodosByTaskIdController
  }
}

async function setupUserNotFound() {
  const mockQuery = jest.fn().mockReturnValue([])
  const { findUserByIdService, connection, clearCompleteTodosByTaskIdController } =
    buildController(mockQuery)
  const foundUser = await findUserByIdService.execute(userId)
  return { connection, foundUser, clearCompleteTodosByTaskIdController }
}

async function setupUserFoundButTaskNotFound() {
  const mockQuery = jest
    .fn()
    .mockReturnValueOnce([userDB])
    .mockReturnValueOnce([])
    .mockReturnValueOnce([userDB])
    .mockReturnValueOnce([])
  const {
    findUserByIdService,
    findTaskByIdService,
    connection,
    clearCompleteTodosByTaskIdController
  } = buildController(mockQuery)
  const foundUser = await findUserByIdService.execute(userId)
  const foundTask = await findTaskByIdService.execute(taskId)
  return { connection, foundUser, foundTask, clearCompleteTodosByTaskIdController }
}

async function setupUserAndTaskFound() {
  const mockQuery = jest
    .fn()
    .mockReturnValueOnce([userDB])
    .mockReturnValueOnce([taskDB])
    .mockReturnValueOnce([userDB])
    .mockReturnValueOnce([taskDB])
  const {
    findUserByIdService,
    findTaskByIdService,
    connection,
    clearCompleteTodosByTaskIdController
  } = buildController(mockQuery)
  const foundUser = await findUserByIdService.execute(userId)
  const foundTask = await findTaskByIdService.execute(taskId)
  return { connection, foundUser, foundTask, clearCompleteTodosByTaskIdController }
}

function expectsValidRequest(request: AdaptedRequest<null>, userId: string, taskId: string) {
  expect(request.body).toBeNull()
  expect(request.authToken.userId).toBe(userId)
  expect(request.params.taskId).toBe(taskId)
}
