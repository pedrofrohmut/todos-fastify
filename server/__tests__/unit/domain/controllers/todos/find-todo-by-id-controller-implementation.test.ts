import { AdaptedRequest } from "../../../../../src/domain/types/router.types"

import TodoValidatorImplementation from "../../../../../src/domain/validators/implementations/todo.validator"
import PostgresFindUserByIdService from "../../../../../src/domain/services/users/implementations/postgres-find-user-by-id.service"
import PostgresFindTodoByIdService from "../../../../../src/domain/services/todos/implementations/postgres-find-todo-by-id.service"
import FindTodoByIdUseCaseImplementation from "../../../../../src/domain/usecases/todos/implementations/find-todo-by-id.usecase"
import FindTodoByIdControllerImplementation from "../../../../../src/domain/controllers/todos/implementations/find-todo-by-id.controller"

import MissingRequestParamsError from "../../../../../src/domain/errors/controllers/missing-request-params.error"

import FakeTodoService from "../../../../utils/fakes/todo-service.fake"
import FakeTokenService from "../../../../utils/fakes/token-service.fake"
import FakeUserService from "../../../../utils/fakes/user-service.fake"
import {
  expectsControllerResponse400AndMessage,
  expectsControllerResponse401AndMessage
} from "../../../../utils/functions/expects.functions"
import MockConnection, {
  MockConnectionAcceptQuery
} from "../../../../utils/mocks/domain/database/database-connection.mock"
import MissingRequestAuthTokenError from "../../../../../src/domain/errors/controllers/missing-request-auth-token.error"
import UserNotFoundByIdError from "../../../../../src/domain/errors/users/user-not-found-by-id.error"
import TodoNotFoundByIdError from "../../../../../src/domain/errors/todos/todo-not-found-by-id.error"

const expectsValidRequest = (request: any): void => {
  expect(request.body).toBeNull()
  expect(request.authToken.userId).toBeTruthy()
  expect(request.authToken.userId).toBeString()
  expect(request.params.todoId).toBeTruthy()
  expect(request.params.todoId).toBeString()
}

const todoId = FakeTodoService.getValidTodoId()
const userId = FakeUserService.getValidUserId()
const token = FakeTokenService.getValid(userId)
const authToken = FakeTokenService.decode(token)
const userDB = FakeUserService.getUserDB("1", userId)
const foundUserFromService = FakeUserService.getUserFromService(userDB)
const todoDB = FakeTodoService.getTodoDB("1", userId, null, todoId)
const foundTodoFromService = FakeTodoService.getTodoFromService(todoDB)

const todoValidator = new TodoValidatorImplementation()
const connection = MockConnection()
const findUserByIdService = new PostgresFindUserByIdService(connection)
const findTodoByIdService = new PostgresFindTodoByIdService(connection)
const findTodoByIdUseCase = new FindTodoByIdUseCaseImplementation(
  findUserByIdService,
  findTodoByIdService
)
const findTodoByIdController = new FindTodoByIdControllerImplementation(
  todoValidator,
  findTodoByIdUseCase
)

let request: AdaptedRequest<null>

beforeEach(() => {
  const adaptedRequest = {
    body: null,
    authToken,
    params: { todoId }
  }
  request = { ...adaptedRequest }
})

describe("FindTodoByIdControllerImplementation", () => {
  test("Null params => 400/message", async () => {
    request.params = null
    // Given
    expect(request.params).toBeNull()
    // When
    const controllerResponse = await findTodoByIdController.execute(request)
    // Then
    expectsControllerResponse400AndMessage(controllerResponse)
    expect(controllerResponse.body).toContain(MissingRequestParamsError.message)
  })

  test("Invalid params for todoId => 400/message", async () => {
    // @ts-ignore
    request.params.todoId = 123
    const todoIdValidationMessage = todoValidator.getMessageForId(request.params.todoId)
    // Given
    expect(todoIdValidationMessage).not.toBeNull()
    // When
    const controllerResponse = await findTodoByIdController.execute(request)
    // Then
    expectsControllerResponse400AndMessage(controllerResponse)
    expect(controllerResponse.body).toContain(todoIdValidationMessage)
  })

  test("Null authToken => 401/message", async () => {
    request.authToken = null
    // Given
    expect(request.authToken).toBeNull()
    // When
    const controllerResponse = await findTodoByIdController.execute(request)
    // Then
    expectsControllerResponse401AndMessage(controllerResponse)
    expect(controllerResponse.body).toContain(MissingRequestAuthTokenError.message)
  })

  test("Valid request. But user bot found by authToken.userId => 400/message", async () => {
    const { foundUser, findTodoByIdController } = await setupUserNotFound()
    // Given
    expectsValidRequest(request)
    expect(foundUser).toBeNull()
    // When
    const controllerResponse = await findTodoByIdController.execute(request)
    // Then
    expectsControllerResponse400AndMessage(controllerResponse)
    expect(controllerResponse.body).toContain(UserNotFoundByIdError.message)
  })

  test("Valid request and user found. But todo not found by params.todoId => 400/message", async () => {
    const { foundUser, foundTodo, findTodoByIdController } = await setupUserFoundButTodoNotFound()
    // Given
    expectsValidRequest(request)
    expect(foundUser).toEqual(foundUserFromService)
    expect(foundTodo).toBeNull()
    // When
    const controllerResponse = await findTodoByIdController.execute(request)
    // Then
    expectsControllerResponse400AndMessage(controllerResponse)
    expect(controllerResponse.body).toContain(TodoNotFoundByIdError.message)
  })

  test("Valid request, user found and todo found => 200/Todo", async () => {
    const { foundUser, foundTodo, findTodoByIdController } = await setupUserAndTodoFound()
    // Given
    expectsValidRequest(request)
    expect(foundUser).toEqual(foundUserFromService)
    expect(foundTodo).toEqual(foundTodoFromService)
    // When
    const controllerResponse = await findTodoByIdController.execute(request)
    // Then
    expect(controllerResponse.status).toBe(200)
    expect(controllerResponse.body).toEqual(foundTodoFromService)
  })
})

async function setupUserAndTodoFound() {
  const mockQuery = jest
    .fn()
    .mockReturnValueOnce([userDB])
    .mockReturnValueOnce([todoDB])
    .mockReturnValueOnce([userDB])
    .mockReturnValueOnce([todoDB])
  const connection = MockConnectionAcceptQuery(mockQuery)()
  const findUserByIdService = new PostgresFindUserByIdService(connection)
  const findTodoByIdService = new PostgresFindTodoByIdService(connection)
  const findTodoByIdUseCase = new FindTodoByIdUseCaseImplementation(
    findUserByIdService,
    findTodoByIdService
  )
  const findTodoByIdController = new FindTodoByIdControllerImplementation(
    todoValidator,
    findTodoByIdUseCase
  )
  const foundUser = await findUserByIdService.execute(request.authToken.userId)
  const foundTodo = await findTodoByIdService.execute(request.params.todoId)
  return { foundUser, foundTodo, findTodoByIdController }
}

async function setupUserFoundButTodoNotFound() {
  const mockQuery = jest
    .fn()
    .mockReturnValueOnce([userDB])
    .mockReturnValueOnce([])
    .mockReturnValueOnce([userDB])
    .mockReturnValueOnce([])
  const connection = MockConnectionAcceptQuery(mockQuery)()
  const findUserByIdService = new PostgresFindUserByIdService(connection)
  const findTodoByIdService = new PostgresFindTodoByIdService(connection)
  const findTodoByIdUseCase = new FindTodoByIdUseCaseImplementation(
    findUserByIdService,
    findTodoByIdService
  )
  const findTodoByIdController = new FindTodoByIdControllerImplementation(
    todoValidator,
    findTodoByIdUseCase
  )
  const foundUser = await findUserByIdService.execute(request.authToken.userId)
  const foundTodo = await findTodoByIdService.execute(request.params.todoId)
  return { foundUser, foundTodo, findTodoByIdController }
}

async function setupUserNotFound() {
  const mockQuery = jest.fn().mockReturnValue([])
  const connection = MockConnectionAcceptQuery(mockQuery)()
  const findUserByIdService = new PostgresFindUserByIdService(connection)
  const findTodoByIdUseCase = new FindTodoByIdUseCaseImplementation(
    findUserByIdService,
    findTodoByIdService
  )
  const findTodoByIdController = new FindTodoByIdControllerImplementation(
    todoValidator,
    findTodoByIdUseCase
  )
  const foundUser = await findUserByIdService.execute(request.authToken.userId)
  return { foundUser, findTodoByIdController }
}
