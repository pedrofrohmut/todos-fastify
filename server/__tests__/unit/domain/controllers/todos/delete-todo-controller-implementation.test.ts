import { AdaptedRequest } from "../../../../../src/domain/types/router.types"

import TodoValidatorImplementation from "../../../../../src/domain/validators/implementations/todo.validator"
import PostgresFindUserByIdService from "../../../../../src/domain/services/users/implementations/postgres-find-user-by-id.service"
import PostgresFindTodoByIdService from "../../../../../src/domain/services/todos/implementations/postgres-find-todo-by-id.service"
import PostgresDeleteTodoService from "../../../../../src/domain/services/todos/implementations/postgres-delete-todo.service"
import DeleteTodoUseCaseImplementation from "../../../../../src/domain/usecases/todos/implementations/delete-todo.usecase"
import DeleteTodoControllerImplementation from "../../../../../src/domain/controllers/todos/implementations/delete-todo.controller"

import MissingRequestParamsError from "../../../../../src/domain/errors/controllers/missing-request-params.error"

import FakeTokenService from "../../../../utils/fakes/token-service.fake"
import FakeUserService from "../../../../utils/fakes/user-service.fake"
import FakeTodoService from "../../../../utils/fakes/todo-service.fake"
import { expectsControllerResponse204, expectsControllerResponse400AndMessage, expectsControllerResponse401AndMessage } from "../../../../utils/functions/expects.functions"
import MockConnection, {MockConnectionAcceptQuery} from "../../../../utils/mocks/domain/database/database-connection.mock"
import MissingRequestAuthTokenError from "../../../../../src/domain/errors/controllers/missing-request-auth-token.error"
import UserNotFoundByIdError from "../../../../../src/domain/errors/users/user-not-found-by-id.error"
import TodoNotFoundByIdError from "../../../../../src/domain/errors/todos/todo-not-found-by-id.error"

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
const deleteTodoService = new PostgresDeleteTodoService(connection)
const deleteTodoUseCase = new DeleteTodoUseCaseImplementation(
  findUserByIdService,
  findTodoByIdService,
  deleteTodoService
)
const deleteTodoController = new DeleteTodoControllerImplementation(
  todoValidator,
  deleteTodoUseCase
)

let request: AdaptedRequest<null>

beforeEach(() => {
  const adaptedRequest = Object.freeze({
    body: null,
    authToken,
    params: {
      todoId
    }
  })
  request = { ...adaptedRequest }
})

describe("DeleteTodoControllerImplementation", () => {
  test("Null params => 400/message", async () => {
    request.params = null
    // Given
    expect(request.params).toBeNull()
    // When
    const controllerResponse = await deleteTodoController.execute(request)
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
    const controllerResponse = await deleteTodoController.execute(request)
    // Then
    expectsControllerResponse400AndMessage(controllerResponse)
    expect(controllerResponse.body).toContain(todoIdValidationMessage)
  })

  test("Null authToken => 401/message", async () => {
    request.authToken = null
    // Given
    expect(request.authToken).toBeNull()
    // When
    const controllerResponse = await deleteTodoController.execute(request)
    // Then
    expectsControllerResponse401AndMessage(controllerResponse)
    expect(controllerResponse.body).toContain(MissingRequestAuthTokenError.message)
  })

  test("Valid request. But user not found by authToken.userId => 400/message", async () => {
    const mockQuery = jest.fn().mockReturnValue([])
    const connection = MockConnectionAcceptQuery(mockQuery)()
    const findUserByIdService = new PostgresFindUserByIdService(connection)
    const deleteTodoUseCase = new DeleteTodoUseCaseImplementation(findUserByIdService, findTodoByIdService, deleteTodoService)
    const deleteTodoController = new DeleteTodoControllerImplementation(todoValidator, deleteTodoUseCase)
    const foundUser = await findUserByIdService.execute(request.authToken.userId)
    // Given
    expectsValidRequest(request, userId, todoId)
    expect(connection.query).toHaveBeenCalledTimes(1)
    expect(foundUser).toBeNull()
    // When
    const controllerResponse = await deleteTodoController.execute(request)
    // Then
    expect(connection.query).toHaveBeenCalledTimes(2)
    expect(connection.mutate).not.toHaveBeenCalled()
    expectsControllerResponse400AndMessage(controllerResponse)
    expect(controllerResponse.body).toContain(UserNotFoundByIdError.message)
  })

  test("Valid request and user found. But todo not found by params.todoId => 400/message", async () => {
    const mockQuery = jest.fn().mockReturnValueOnce([userDB]).mockReturnValueOnce([]).mockReturnValueOnce([userDB]).mockReturnValueOnce([])
    const connection = MockConnectionAcceptQuery(mockQuery)()
    const findUserByIdService = new PostgresFindUserByIdService(connection)
    const findTodoByIdService = new PostgresFindTodoByIdService(connection)
    const deleteTodoUseCase = new DeleteTodoUseCaseImplementation(findUserByIdService, findTodoByIdService, deleteTodoService)
    const deleteTodoController = new DeleteTodoControllerImplementation(todoValidator, deleteTodoUseCase)
    const foundUser = await findUserByIdService.execute(request.authToken.userId)
    const foundTodo = await findTodoByIdService.execute(request.params.todoId)
    // Given
    expectsValidRequest(request, userId, todoId)
    expect(connection.query).toHaveBeenCalledTimes(2)
    expect(foundUser).toEqual(foundUserFromService)
    expect(foundTodo).toBeNull()
    // When
    const controllerResponse = await deleteTodoController.execute(request)
    // Then
    expect(connection.query).toHaveBeenCalledTimes(4)
    expect(connection.mutate).not.toHaveBeenCalled()
    expectsControllerResponse400AndMessage(controllerResponse)
    expect(controllerResponse.body).toContain(TodoNotFoundByIdError.message)
  })

  test("Valid request, user and todo found => 204", async () => {
    const mockQuery = jest.fn().mockReturnValueOnce([userDB]).mockReturnValueOnce([todoDB]).mockReturnValueOnce([userDB]).mockReturnValueOnce([todoDB])
    const connection = MockConnectionAcceptQuery(mockQuery)()
    const findUserByIdService = new PostgresFindUserByIdService(connection)
    const findTodoByIdService = new PostgresFindTodoByIdService(connection)
    const deleteTodoUseCase = new DeleteTodoUseCaseImplementation(findUserByIdService, findTodoByIdService, deleteTodoService)
    const deleteTodoController = new DeleteTodoControllerImplementation(todoValidator, deleteTodoUseCase)
    const foundUser = await findUserByIdService.execute(request.authToken.userId)
    const foundTodo = await findTodoByIdService.execute(request.params.todoId)
    // Given
    expectsValidRequest(request, userId, todoId)
    expect(connection.query).toHaveBeenCalledTimes(2)
    expect(foundUser).toEqual(foundUserFromService)
    expect(foundTodo).toEqual(foundTodoFromService)
    // When
    const controllerResponse = await deleteTodoController.execute(request)
    // Then
    expect(connection.query).toHaveBeenCalledTimes(4)
    expect(connection.mutate).toHaveBeenCalledTimes(1)
    expectsControllerResponse204(controllerResponse)
  })
})

function expectsValidRequest(request: AdaptedRequest<null>, userId: string, todoId: string) {
  expect(request.body).toBeNull()
  expect(request.authToken.userId).toBe(userId)
  expect(request.params.todoId).toBe(todoId)
}
