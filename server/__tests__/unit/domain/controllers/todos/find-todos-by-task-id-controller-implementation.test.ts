import { AdaptedRequest } from "../../../../../src/domain/types/router.types"

import TaskValidatorImplementation from "../../../../../src/domain/validators/implementations/task.validator"
import PostgresFindTaskByIdService from "../../../../../src/domain/services/tasks/implementations/postgres-find-task-by-id.service"
import PostgresFindTodosByTaskIdService from "../../../../../src/domain/services/todos/implementations/postgres-find-todos-by-task-id.service"
import PostgresFindUserByIdService from "../../../../../src/domain/services/users/implementations/postgres-find-user-by-id.service"
import FindTodosByTaskIdUseCaseImplementation from "../../../../../src/domain/usecases/todos/implementations/find-todos-by-task-id.usecase"
import FindTodosByTaskIdControllerImplementation from "../../../../../src/domain/controllers/todos/implementations/find-todos-by-task-id.controller"

import MissingRequestParamsError from "../../../../../src/domain/errors/controllers/missing-request-params.error"

import FakeTaskService from "../../../../utils/fakes/task-service.fake"
import FakeTokenService from "../../../../utils/fakes/token-service.fake"
import FakeUserService from "../../../../utils/fakes/user-service.fake"
import MockConnection, {
  MockConnectionAcceptQuery
} from "../../../../utils/mocks/domain/database/database-connection.mock"
import {
  expectsControllerResponse400AndMessage,
  expectsControllerResponse401AndMessage
} from "../../../../utils/functions/expects.functions"
import MissingRequestAuthTokenError from "../../../../../src/domain/errors/controllers/missing-request-auth-token.error"
import UserNotFoundByIdError from "../../../../../src/domain/errors/users/user-not-found-by-id.error"
import TaskNotFoundByIdError from "../../../../../src/domain/errors/tasks/task-not-found-by-id.error"
import FakeTodoService from "../../../../utils/fakes/todo-service.fake"

const taskId = FakeTaskService.getValidTaskId()
const userId = FakeUserService.getValidUserId()
const token = FakeTokenService.getValid(userId)
const authToken = FakeTokenService.decode(token)
const userDB = FakeUserService.getUserDB("1", userId)
const foundUserFromService = FakeUserService.getUserFromService(userDB)
const taskDB = FakeTaskService.getTaskDB("1", userId, taskId)
const foundTaskFromService = FakeTaskService.getTaskFromService(taskDB)
const todoDB1 = FakeTodoService.getTodoDB("1", userId, taskId, null)
const todoDB2 = FakeTodoService.getTodoDB("2", userId, taskId, null)
const todoDB3 = FakeTodoService.getTodoDB("3", userId, taskId, null)
const foundTodoFromService1 = FakeTodoService.getTodoFromService(todoDB1)
const foundTodoFromService2 = FakeTodoService.getTodoFromService(todoDB2)
const foundTodoFromService3 = FakeTodoService.getTodoFromService(todoDB3)

const taskValidator = new TaskValidatorImplementation()
const connection = MockConnection()
const findUserByIdService = new PostgresFindUserByIdService(connection)
const findTaskByIdService = new PostgresFindTaskByIdService(connection)
const findTodosByTaskIdService = new PostgresFindTodosByTaskIdService(connection)
const findTodosByTaskIdUseCase = new FindTodosByTaskIdUseCaseImplementation(
  findUserByIdService,
  findTaskByIdService,
  findTodosByTaskIdService
)
const findTodosByTaskIdController = new FindTodosByTaskIdControllerImplementation(
  taskValidator,
  findTodosByTaskIdUseCase
)

let request: AdaptedRequest<null>

beforeEach(() => {
  const adaptedRequet = {
    body: null,
    authToken,
    params: { taskId }
  }
  request = { ...adaptedRequet }
})

describe("FindTodosByTaskIdControllerImplementation", () => {
  test("Null params => 400/message", async () => {
    request.params = null
    // Given
    expect(request.params).toBeNull()
    // When
    const controllerResponse = await findTodosByTaskIdController.execute(request)
    // Then
    expectsControllerResponse400AndMessage(controllerResponse)
    expect(controllerResponse.body).toContain(MissingRequestParamsError.message)
  })

  test("Invalid params for taskId => 400/message", async () => {
    request.params.taskId = "123"
    const taskIdValidationMessage = taskValidator.getMessageForId(request.params.taskId)
    // Given
    expect(taskIdValidationMessage).not.toBeNull()
    // When
    const controllerResponse = await findTodosByTaskIdController.execute(request)
    // Then
    expectsControllerResponse400AndMessage(controllerResponse)
    expect(controllerResponse.body).toContain(taskIdValidationMessage)
  })

  test("Null authToken => 401/message", async () => {
    request.authToken = null
    // Given
    expect(request.authToken).toBeNull()
    // When
    const controllerResponse = await findTodosByTaskIdController.execute(request)
    // Then
    expectsControllerResponse401AndMessage(controllerResponse)
    expect(controllerResponse.body).toContain(MissingRequestAuthTokenError.message)
  })

  test("Valid request. But user not found => 400/message", async () => {
    const { connection, foundUser, findTodosByTaskIdController } = await setupUserNotFound()
    // Given
    expectsValidRequest(request, userId, taskId)
    expect(connection.query).toHaveBeenCalledTimes(1)
    expect(foundUser).toBeNull()
    // When
    const controllerResponse = await findTodosByTaskIdController.execute(request)
    // Then
    expectsControllerResponse400AndMessage(controllerResponse)
    expect(connection.query).toHaveBeenCalledTimes(2)
    expect(controllerResponse.body).toContain(UserNotFoundByIdError.message)
  })

  test("Valid request and user found. But task not found by id => 400/message", async () => {
    const { connection, foundUser, foundTask, findTodosByTaskIdController } =
      await setupUserFoundButTaskNotFound()
    // Given
    expectsValidRequest(request, userId, taskId)
    expect(connection.query).toHaveBeenCalledTimes(2)
    expect(foundUser).toEqual(foundUserFromService)
    expect(foundTask).toBeNull()
    // When
    const controllerResponse = await findTodosByTaskIdController.execute(request)
    // Then
    expectsControllerResponse400AndMessage(controllerResponse)
    expect(connection.query).toHaveBeenCalledTimes(4)
    expect(controllerResponse.body).toContain(TaskNotFoundByIdError.message)
  })

  test("Valid request, user and task found. But todos not found => 200/empty array", async () => {
    const { connection, foundUser, foundTask, foundTodos, findTodosByTaskIdController } =
      await setupUserAndTaskFoundButTodosNotFound()
    // Given
    expectsValidRequest(request, userId, taskId)
    expect(connection.query).toHaveBeenCalledTimes(3)
    expect(foundUser).toEqual(foundUserFromService)
    expect(foundTask).toEqual(foundTaskFromService)
    expect(foundTodos).toBeArrayOfSize(0)
    // When
    const controllerResponse = await findTodosByTaskIdController.execute(request)
    // Then
    expect(controllerResponse.status).toBe(200)
    expect(connection.query).toHaveBeenCalledTimes(6)
    expect(controllerResponse.body).toBeArrayOfSize(0)
  })

  test("Valid request, user, task and todos found => 200/array filled with found todos", async () => {
    const { connection, foundUser, foundTask, foundTodos, findTodosByTaskIdController } =
      await setupUserTaskAndTodosFound()
    // Given
    expectsValidRequest(request, userId, taskId)
    expect(connection.query).toHaveBeenCalledTimes(3)
    expect(foundUser).toEqual(foundUserFromService)
    expect(foundTask).toEqual(foundTaskFromService)
    expect(foundTodos).toIncludeAllMembers([
      foundTodoFromService1,
      foundTodoFromService2,
      foundTodoFromService3
    ])
    // When
    const controllerResponse = await findTodosByTaskIdController.execute(request)
    // Then
    expect(controllerResponse.status).toBe(200)
    expect(connection.query).toHaveBeenCalledTimes(6)
    expect(controllerResponse.body).toIncludeAllMembers([
      foundTodoFromService1,
      foundTodoFromService2,
      foundTodoFromService3
    ])
  })
})

async function setupUserTaskAndTodosFound() {
  const mockQuery = jest
    .fn()
    .mockReturnValueOnce([userDB])
    .mockReturnValueOnce([taskDB])
    .mockReturnValueOnce([todoDB1, todoDB2, todoDB3])
    .mockReturnValueOnce([userDB])
    .mockReturnValueOnce([taskDB])
    .mockReturnValueOnce([todoDB1, todoDB2, todoDB3])
  const connection = MockConnectionAcceptQuery(mockQuery)()
  const findUserByIdService = new PostgresFindUserByIdService(connection)
  const findTaskByIdService = new PostgresFindTaskByIdService(connection)
  const findTodosByTaskIdService = new PostgresFindTodosByTaskIdService(connection)
  const findTodosByTaskIdUseCase = new FindTodosByTaskIdUseCaseImplementation(
    findUserByIdService,
    findTaskByIdService,
    findTodosByTaskIdService
  )
  const findTodosByTaskIdController = new FindTodosByTaskIdControllerImplementation(
    taskValidator,
    findTodosByTaskIdUseCase
  )
  const foundUser = await findUserByIdService.execute(userId)
  const foundTask = await findTaskByIdService.execute(taskId)
  const foundTodos = await findTodosByTaskIdService.execute(taskId)
  return { connection, foundUser, foundTask, foundTodos, findTodosByTaskIdController }
}

async function setupUserAndTaskFoundButTodosNotFound() {
  const mockQuery = jest
    .fn()
    .mockReturnValueOnce([userDB])
    .mockReturnValueOnce([taskDB])
    .mockReturnValueOnce([])
    .mockReturnValueOnce([userDB])
    .mockReturnValueOnce([taskDB])
    .mockReturnValueOnce([])
  const connection = MockConnectionAcceptQuery(mockQuery)()
  const findUserByIdService = new PostgresFindUserByIdService(connection)
  const findTaskByIdService = new PostgresFindTaskByIdService(connection)
  const findTodosByTaskIdService = new PostgresFindTodosByTaskIdService(connection)
  const findTodosByTaskIdUseCase = new FindTodosByTaskIdUseCaseImplementation(
    findUserByIdService,
    findTaskByIdService,
    findTodosByTaskIdService
  )
  const findTodosByTaskIdController = new FindTodosByTaskIdControllerImplementation(
    taskValidator,
    findTodosByTaskIdUseCase
  )
  const foundUser = await findUserByIdService.execute(userId)
  const foundTask = await findTaskByIdService.execute(taskId)
  const foundTodos = await findTodosByTaskIdService.execute(taskId)
  return { connection, foundUser, foundTask, foundTodos, findTodosByTaskIdController }
}

async function setupUserFoundButTaskNotFound() {
  const mockQuery = jest
    .fn()
    .mockReturnValueOnce([userDB])
    .mockReturnValueOnce([])
    .mockReturnValueOnce([userDB])
    .mockReturnValueOnce([])
  const connection = MockConnectionAcceptQuery(mockQuery)()
  const findUserByIdService = new PostgresFindUserByIdService(connection)
  const findTaskByIdService = new PostgresFindTaskByIdService(connection)
  const findTodosByTaskIdUseCase = new FindTodosByTaskIdUseCaseImplementation(
    findUserByIdService,
    findTaskByIdService,
    findTodosByTaskIdService
  )
  const findTodosByTaskIdController = new FindTodosByTaskIdControllerImplementation(
    taskValidator,
    findTodosByTaskIdUseCase
  )
  const foundUser = await findUserByIdService.execute(userId)
  const foundTask = await findTaskByIdService.execute(taskId)
  return { connection, foundUser, foundTask, findTodosByTaskIdController }
}

async function setupUserNotFound() {
  const mockQuery = jest.fn().mockReturnValue([])
  const connection = MockConnectionAcceptQuery(mockQuery)()
  const findUserByIdService = new PostgresFindUserByIdService(connection)
  const findTodosByTaskIdUseCase = new FindTodosByTaskIdUseCaseImplementation(
    findUserByIdService,
    findTaskByIdService,
    findTodosByTaskIdService
  )
  const findTodosByTaskIdController = new FindTodosByTaskIdControllerImplementation(
    taskValidator,
    findTodosByTaskIdUseCase
  )
  const foundUser = await findUserByIdService.execute(userId)
  return { connection, foundUser, findTodosByTaskIdController }
}

function expectsValidRequest(request: AdaptedRequest<null>, userId: string, taskId: string): void {
  expect(request).toBeTruthy()
  expect(request.body).toBeNull()
  expect(request.authToken.userId).toBe(userId)
  expect(request.params.taskId).toBe(taskId)
}
