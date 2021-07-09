import { AdaptedRequest } from "../../../../../src/domain/types/router.types"

import TodoValidatorImplementation from "../../../../../src/domain/validators/implementations/todo.validator"
import PostgresFindTodoByIdService from "../../../../../src/domain/services/todos/implementations/postgres-find-todo-by-id.service"
import PostgresSetTodoAsDoneService from "../../../../../src/domain/services/todos/implementations/postgres-set-todo-as-done.service"
import PostgresFindUserByIdService from "../../../../../src/domain/services/users/implementations/postgres-find-user-by-id.service"
import SetTodoAsDoneUseCaseImplementation from "../../../../../src/domain/usecases/todos/implementations/set-todo-as-done.usecase"
import SetTodoAsDoneControllerImplementation from "../../../../../src/domain/controllers/todos/implementations/set-todo-as-done.controller"

import MissingRequestParamsError from "../../../../../src/domain/errors/controllers/missing-request-params.error"
import MissingRequestAuthTokenError from "../../../../../src/domain/errors/controllers/missing-request-auth-token.error"
import UserNotFoundByIdError from "../../../../../src/domain/errors/users/user-not-found-by-id.error"
import TodoNotFoundByIdError from "../../../../../src/domain/errors/todos/todo-not-found-by-id.error"

import FakeTodoService from "../../../../utils/fakes/todo-service.fake"
import FakeTokenService from "../../../../utils/fakes/token-service.fake"
import FakeUserService from "../../../../utils/fakes/user-service.fake"
import MockConnection, {
  MockConnectionAcceptQuery
} from "../../../../utils/mocks/domain/database/database-connection.mock"
import {
  expectsControllerResponse204,
  expectsControllerResponse400AndMessage,
  expectsControllerResponse401AndMessage
} from "../../../../utils/functions/expects.functions"

const userId = FakeUserService.getValidUserId()
const token = FakeTokenService.getValid(userId)
const authToken = FakeTokenService.decode(token)
const todoId = FakeTodoService.getValidTodoId()
const userDB = FakeUserService.getUserDB("1", userId)
const foundUserFromService = FakeUserService.getUserFromService(userDB)
const todoDB = FakeTodoService.getTodoDB("1", userId, null, todoId)
const foundTodoFromService = FakeTodoService.getTodoFromService(todoDB)

const todoValidator = new TodoValidatorImplementation()
const connection = MockConnection()
const findUserByIdService = new PostgresFindUserByIdService(connection)
const findTodoByIdService = new PostgresFindTodoByIdService(connection)
const setTodoAsDoneService = new PostgresSetTodoAsDoneService(connection)
const setTodoAsDoneUseCase = new SetTodoAsDoneUseCaseImplementation(
  findUserByIdService,
  findTodoByIdService,
  setTodoAsDoneService
)
const setTodoAsDoneController = new SetTodoAsDoneControllerImplementation(
  todoValidator,
  setTodoAsDoneUseCase
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

describe("SetTodoAsDoneControllerImplementation", () => {
  test("Null params => 400/message", async () => {
    request.params = null
    // Given
    expect(request.params).toBeNull()
    // When
    const controllerResponse = await setTodoAsDoneController.execute(request)
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
    const controllerResponse = await setTodoAsDoneController.execute(request)
    // Then
    expectsControllerResponse400AndMessage(controllerResponse)
    expect(controllerResponse.body).toContain(todoIdValidationMessage)
  })

  test("Null authToken => 401/message", async () => {
    request.authToken = null
    // Given
    expect(request.authToken).toBeNull()
    // When
    const controllerResponse = await setTodoAsDoneController.execute(request)
    // Then
    expectsControllerResponse401AndMessage(controllerResponse)
    expect(controllerResponse.body).toContain(MissingRequestAuthTokenError.message)
  })

  test("Valid request. But user not found => 400/message", async () => {
    const { connection, foundUser, setTodoAsDoneController } = await setupUserNotFound()
    // Given
    expectsValidRequest(request, userId, todoId)
    expect(connection.query).toHaveBeenCalledTimes(1)
    expect(foundUser).toBeNull()
    // When
    const controllerResponse = await setTodoAsDoneController.execute(request)
    // Then
    expect(connection.query).toHaveBeenCalledTimes(2)
    expect(connection.mutate).not.toHaveBeenCalled()
    expectsControllerResponse400AndMessage(controllerResponse)
    expect(controllerResponse.body).toContain(UserNotFoundByIdError.message)
  })

  test("Valid request and user found. But todo not found => 400/message", async () => {
    const { connection, foundUser, foundTodo, setTodoAsDoneController } =
      await setupUserFoundButTodoNotFound()
    // Given
    expectsValidRequest(request, userId, todoId)
    expect(connection.query).toHaveBeenCalledTimes(2)
    expect(foundUser).toEqual(foundUserFromService)
    expect(foundTodo).toBeNull()
    // When
    const controllerResponse = await setTodoAsDoneController.execute(request)
    // Then
    expect(connection.query).toHaveBeenCalledTimes(4)
    expect(connection.mutate).not.toHaveBeenCalled()
    expectsControllerResponse400AndMessage(controllerResponse)
    expect(controllerResponse.body).toContain(TodoNotFoundByIdError.message)
  })

  test("Valid request, user and todo found => 204", async () => {
    const { connection, foundUser, foundTodo, setTodoAsDoneController } =
      await setupUserAndTodoFound()
    // Given
    expectsValidRequest(request, userId, todoId)
    expect(connection.query).toHaveBeenCalledTimes(2)
    expect(foundUser).toEqual(foundUserFromService)
    expect(foundTodo).toEqual(foundTodoFromService)
    // When
    const controllerResponse = await setTodoAsDoneController.execute(request)
    // Then
    expect(connection.query).toHaveBeenCalledTimes(4)
    expect(connection.mutate).toHaveBeenCalledTimes(1)
    expectsControllerResponse204(controllerResponse)
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
  const setTodoAsDoneService = new PostgresSetTodoAsDoneService(connection)
  const setTodoAsDoneUseCase = new SetTodoAsDoneUseCaseImplementation(
    findUserByIdService,
    findTodoByIdService,
    setTodoAsDoneService
  )
  const setTodoAsDoneController = new SetTodoAsDoneControllerImplementation(
    todoValidator,
    setTodoAsDoneUseCase
  )
  const foundUser = await findUserByIdService.execute(userId)
  const foundTodo = await findTodoByIdService.execute(todoId)
  return { connection, foundUser, foundTodo, setTodoAsDoneController }
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
  const setTodoAsDoneService = new PostgresSetTodoAsDoneService(connection)
  const setTodoAsDoneUseCase = new SetTodoAsDoneUseCaseImplementation(
    findUserByIdService,
    findTodoByIdService,
    setTodoAsDoneService
  )
  const setTodoAsDoneController = new SetTodoAsDoneControllerImplementation(
    todoValidator,
    setTodoAsDoneUseCase
  )
  const foundUser = await findUserByIdService.execute(userId)
  const foundTodo = await findTodoByIdService.execute(todoId)
  return { connection, foundUser, foundTodo, setTodoAsDoneController }
}

async function setupUserNotFound() {
  const mockQuery = jest.fn().mockReturnValue([])
  const connection = MockConnectionAcceptQuery(mockQuery)()
  const findUserByIdService = new PostgresFindUserByIdService(connection)
  const findTodoByIdService = new PostgresFindTodoByIdService(connection)
  const setTodoAsDoneService = new PostgresSetTodoAsDoneService(connection)
  const setTodoAsDoneUseCase = new SetTodoAsDoneUseCaseImplementation(
    findUserByIdService,
    findTodoByIdService,
    setTodoAsDoneService
  )
  const setTodoAsDoneController = new SetTodoAsDoneControllerImplementation(
    todoValidator,
    setTodoAsDoneUseCase
  )
  const foundUser = await findUserByIdService.execute(userId)
  return { connection, foundUser, setTodoAsDoneController }
}

function expectsValidRequest(request: AdaptedRequest<null>, userId: string, todoId: string) {
  expect(request.body).toBeNull()
  expect(request.authToken.userId).toBe(userId)
  expect(request.params.todoId).toBe(todoId)
}
