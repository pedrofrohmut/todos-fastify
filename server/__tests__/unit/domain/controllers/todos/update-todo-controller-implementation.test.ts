import { UpdateTodoBody } from "../../../../../src/domain/types/request/body.types"
import { AdaptedRequest } from "../../../../../src/domain/types/router.types"

import TodoValidator from "../../../../../src/domain/validators/todo-validator.interface"

import TodoValidatorImplementation from "../../../../../src/domain/validators/implementations/todo.validator"
import PostgresFindTodoByIdService from "../../../../../src/domain/services/todos/implementations/postgres-find-todo-by-id.service"
import PostgresUpdateTodoService from "../../../../../src/domain/services/todos/implementations/postgres-update-todo.service"
import PostgresFindUserByIdService from "../../../../../src/domain/services/users/implementations/postgres-find-user-by-id.service"
import UpdateTodoUseCaseImplementation from "../../../../../src/domain/usecases/todos/implementations/update-todo.usecase"
import UpdateTodoControllerImplementation from "../../../../../src/domain/controllers/todos/implementations/update-todo.controller"

import MissingRequestBodyError from "../../../../../src/domain/errors/controllers/missing-request-body.error"
import MissingRequestAuthTokenError from "../../../../../src/domain/errors/controllers/missing-request-auth-token.error"
import MissingRequestParamsError from "../../../../../src/domain/errors/controllers/missing-request-params.error"
import UserNotFoundByIdError from "../../../../../src/domain/errors/users/user-not-found-by-id.error"
import TodoNotFoundByIdError from "../../../../../src/domain/errors/todos/todo-not-found-by-id.error"

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
const updateTodoService = new PostgresUpdateTodoService(connection)
const updateTodoUseCase = new UpdateTodoUseCaseImplementation(
  findUserByIdService,
  findTodoByIdService,
  updateTodoService
)
const updateTodoController = new UpdateTodoControllerImplementation(
  todoValidator,
  updateTodoUseCase
)

let request: AdaptedRequest<UpdateTodoBody>

beforeEach(() => {
  const adaptedRequest = {
    body: {
      name: "Todo Name Updated",
      description: "Todo Description Updated",
      isDone: false
    },
    authToken,
    params: { todoId }
  }
  request = { ...adaptedRequest }
})

describe("UpdateTodoControllerImplementation", () => {
  test("Null body => 400/message", async () => {
    request.body = null
    // Given
    expect(request.body).toBeNull()
    // When
    const controllerResponse = await updateTodoController.execute(request)
    // Then
    expectsControllerResponse400AndMessage(controllerResponse)
    expect(controllerResponse.body).toContain(MissingRequestBodyError.message)
  })

  test("Invalid body.name => 400/message", async () => {
    // @ts-ignore
    request.body.name = 123
    const nameValidationMessage = todoValidator.getMessageForName(request.body.name)
    // Given
    expect(nameValidationMessage).not.toBeNull()
    // When
    const controllerResponse = await updateTodoController.execute(request)
    // Then
    expectsControllerResponse400AndMessage(controllerResponse)
    expect(controllerResponse.body).toContain(nameValidationMessage)
  })

  test("Invalid body.description => 400/message", async () => {
    // @ts-ignore
    request.body.description = 123
    const descriptionValidationMessage = todoValidator.getMessageForDescription(
      request.body.description
    )
    // Given
    expect(descriptionValidationMessage).not.toBeNull()
    // When
    const controllerResponse = await updateTodoController.execute(request)
    // Then
    expectsControllerResponse400AndMessage(controllerResponse)
    expect(controllerResponse.body).toContain(descriptionValidationMessage)
  })

  test("Invalid body.isDone => 400/message", async () => {
    // @ts-ignore
    request.body.isDone = 123
    const isDoneValidationMessage = todoValidator.getMessageForIsDone(request.body.isDone)
    // Given
    expect(isDoneValidationMessage).not.toBeNull()
    // When
    const controllerResponse = await updateTodoController.execute(request)
    // Then
    expectsControllerResponse400AndMessage(controllerResponse)
    expect(controllerResponse.body).toContain(isDoneValidationMessage)
  })

  test("Null authToken => 401/message", async () => {
    request.authToken = null
    // Given
    expect(request.authToken).toBeNull()
    // When
    const controllerResponse = await updateTodoController.execute(request)
    // Then
    expectsControllerResponse401AndMessage(controllerResponse)
    expect(controllerResponse.body).toContain(MissingRequestAuthTokenError.message)
  })

  test("Null params => 400/message", async () => {
    request.params = null
    // Given
    expect(request.params).toBeNull()
    // When
    const controllerResponse = await updateTodoController.execute(request)
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
    const controllerResponse = await updateTodoController.execute(request)
    // Then
    expectsControllerResponse400AndMessage(controllerResponse)
    expect(controllerResponse.body).toContain(todoIdValidationMessage)
  })

  test("Valid request. But user not found by authToken.userId => 400/message", async () => {
    const { connection, foundUser, updateTodoController } = await setupUserNotFound()
    // Given
    expectsValidRequest(request, userId, todoId, todoValidator)
    expect(connection.query).toHaveBeenCalledTimes(1)
    expect(foundUser).toBeNull()
    // When
    const controllerResponse = await updateTodoController.execute(request)
    // Then
    expectsControllerResponse400AndMessage(controllerResponse)
    expect(connection.query).toHaveBeenCalledTimes(2)
    expect(connection.mutate).not.toHaveBeenCalled()
    expect(controllerResponse.body).toContain(UserNotFoundByIdError.message)
  })

  test("Valid request and user found. But todo not found by params.todoId => 400/message", async () => {
    const { connection, foundUser, foundTodo, updateTodoController } =
      await setupUserFoundButTodoNotFound()
    // Given
    expectsValidRequest(request, userId, todoId, todoValidator)
    expect(connection.query).toHaveBeenCalledTimes(2)
    expect(foundUser).toEqual(foundUserFromService)
    expect(foundTodo).toBeNull()
    // When
    const controllerResponse = await updateTodoController.execute(request)
    // Then
    expectsControllerResponse400AndMessage(controllerResponse)
    expect(connection.query).toHaveBeenCalledTimes(4)
    expect(connection.mutate).not.toHaveBeenCalled()
    expect(controllerResponse.body).toContain(TodoNotFoundByIdError.message)
  })

  test("Valid request, user and todo found => 204", async () => {
    const { connection, foundUser, foundTodo, updateTodoController } = await setupUserAndTodoFound()
    // Given
    expectsValidRequest(request, userId, todoId, todoValidator)
    expect(connection.query).toHaveBeenCalledTimes(2)
    expect(foundUser).toEqual(foundUserFromService)
    expect(foundTodo).toEqual(foundTodoFromService)
    // When
    const controllerResponse = await updateTodoController.execute(request)
    // Then
    expect(controllerResponse.status).toBe(204)
    expect(controllerResponse.body).toBeUndefined()
    expect(connection.query).toHaveBeenCalledTimes(4)
    expect(connection.mutate).toHaveBeenCalledTimes(1)
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
  const updateTodoUseCase = new UpdateTodoUseCaseImplementation(
    findUserByIdService,
    findTodoByIdService,
    updateTodoService
  )
  const updateTodoController = new UpdateTodoControllerImplementation(
    todoValidator,
    updateTodoUseCase
  )
  const foundUser = await findUserByIdService.execute(userId)
  const foundTodo = await findTodoByIdService.execute(todoId)
  return { connection, foundUser, foundTodo, updateTodoController }
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
  const updateTodoUseCase = new UpdateTodoUseCaseImplementation(
    findUserByIdService,
    findTodoByIdService,
    updateTodoService
  )
  const updateTodoController = new UpdateTodoControllerImplementation(
    todoValidator,
    updateTodoUseCase
  )
  const foundUser = await findUserByIdService.execute(userId)
  const foundTodo = await findTodoByIdService.execute(todoId)
  return { connection, foundUser, foundTodo, updateTodoController }
}

async function setupUserNotFound() {
  const mockQuery = jest.fn().mockReturnValue([])
  const connection = MockConnectionAcceptQuery(mockQuery)()
  const findUserByIdService = new PostgresFindUserByIdService(connection)
  const updateTodoUseCase = new UpdateTodoUseCaseImplementation(
    findUserByIdService,
    findTodoByIdService,
    updateTodoService
  )
  const updateTodoController = new UpdateTodoControllerImplementation(
    todoValidator,
    updateTodoUseCase
  )
  const foundUser = await findUserByIdService.execute(userId)
  return { connection, foundUser, updateTodoController }
}

function expectsValidRequest(
  request: AdaptedRequest<UpdateTodoBody>,
  userId: string,
  todoId: string,
  todoValidator: TodoValidator
) {
  const nameValidationMessage = todoValidator.getMessageForName(request.body.name)
  expect(nameValidationMessage).toBeNull()
  const descriptionValidationMessage = todoValidator.getMessageForDescription(
    request.body.description
  )
  expect(descriptionValidationMessage).toBeNull()
  const isDoneValidationMessage = todoValidator.getMessageForIsDone(request.body.isDone)
  expect(isDoneValidationMessage).toBeNull()
  expect(request.authToken.userId).toBe(userId)
  expect(request.params.todoId).toBe(todoId)
}
