import { CreateTodoBody } from "../../../../../src/domain/types/request/body.types"
import { AdaptedRequest } from "../../../../../src/domain/types/router.types"

import TaskValidatorImplementation from "../../../../../src/domain/validators/implementations/task.validator"
import TodoValidatorImplementation from "../../../../../src/domain/validators/implementations/todo.validator"
import PostgresFindUserByIdService from "../../../../../src/domain/services/users/implementations/postgres-find-user-by-id.service"
import PostgresFindTaskByIdService from "../../../../../src/domain/services/tasks/implementations/postgres-find-task-by-id.service"
import PostgresCreateTodoService from "../../../../../src/domain/services/todos/implementations/postgres-create-todo.service"
import CreateTodoUseCaseImplementation from "../../../../../src/domain/usecases/todos/implementations/create-todo.usecase"
import CreateTodoControllerImplementation from "../../../../../src/domain/controllers/todos/implementations/create-todo.controller"

import MissingRequestBodyError from "../../../../../src/domain/errors/controllers/missing-request-body.error"

import FakeTaskService from "../../../../utils/fakes/task-service.fake"
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
import TaskNotFoundByIdError from "../../../../../src/domain/errors/tasks/task-not-found-by-id.error"

const expectsValidRequest = (request: any): void => {
  const nameValidationMessage = todoValidator.getMessageForName(request.body.name)
  expect(nameValidationMessage).toBeNull()
  const descriptionValidationMessage = todoValidator.getMessageForDescription(
    request.body.description
  )
  expect(descriptionValidationMessage).toBeNull()
  const taskIdValidationMessage = taskValidator.getMessageForId(request.body.taskId)
  expect(taskIdValidationMessage).toBeNull()
  expect(request.authToken.userId).toBeString()
  expect(request.authToken.userId).toBeTruthy()
}

const userId = FakeUserService.getValidUserId()
const taskId = FakeTaskService.getValidTaskId()
const token = FakeTokenService.getValid(userId)
const authToken = FakeTokenService.decode(token)
const userDB = FakeUserService.getUserDB("1", userId)
const foundUserFromService = FakeUserService.getUserFromService(userDB)
const taskDB = FakeTaskService.getTaskDB("1", userId, taskId)
const foundTaskFromService = FakeTaskService.getTaskFromService(taskDB)

const connection = MockConnection()
const todoValidator = new TodoValidatorImplementation()
const taskValidator = new TaskValidatorImplementation()
const findUserByIdService = new PostgresFindUserByIdService(connection)
const findTaskByIdService = new PostgresFindTaskByIdService(connection)
const createTodoService = new PostgresCreateTodoService(connection)
const createTodoUseCase = new CreateTodoUseCaseImplementation(
  findUserByIdService,
  findTaskByIdService,
  createTodoService
)
const createTodoController = new CreateTodoControllerImplementation(
  todoValidator,
  taskValidator,
  createTodoUseCase
)

let request: AdaptedRequest<CreateTodoBody>

beforeEach(() => {
  const adaptedRequest = {
    body: {
      name: "Todo Name",
      description: "Todo Description",
      taskId
    },
    authToken,
    params: { taskId }
  }
  request = { ...adaptedRequest }
})

describe("CreateTodoControllerImplementation", () => {
  test("Null body => 400/message", async () => {
    request.body = null
    // Given
    expect(request.body).toBeNull()
    // When
    const controllerResponse = await createTodoController.execute(request)
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
    const controllerResponse = await createTodoController.execute(request)
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
    const controllerResponse = await createTodoController.execute(request)
    // Then
    expectsControllerResponse400AndMessage(controllerResponse)
    expect(controllerResponse.body).toContain(descriptionValidationMessage)
  })

  test("Invalid body.taskId => 400/message", async () => {
    // @ts-ignore
    request.body.taskId = 123
    const taskIdValidationMessage = taskValidator.getMessageForId(request.body.taskId)
    // Given
    expect(taskIdValidationMessage).not.toBeNull()
    // When
    const controllerResponse = await createTodoController.execute(request)
    // Then
    expectsControllerResponse400AndMessage(controllerResponse)
    expect(controllerResponse.body).toContain(taskIdValidationMessage)
  })

  test("Null authToken => 401/message", async () => {
    request.authToken = null
    // Given
    expect(request.authToken).toBeNull()
    // When
    const controllerResponse = await createTodoController.execute(request)
    // Then
    expectsControllerResponse401AndMessage(controllerResponse)
    expect(controllerResponse.body).toContain(MissingRequestAuthTokenError.message)
  })

  test("Valid request. But user not found by authToken.userId => 400/message", async () => {
    const mockQuery = jest.fn().mockReturnValue([])
    const connection = MockConnectionAcceptQuery(mockQuery)()
    const findUserByIdService = new PostgresFindUserByIdService(connection)
    const createTodoUseCase = new CreateTodoUseCaseImplementation(
      findUserByIdService,
      findTaskByIdService,
      createTodoService
    )
    const createTodoController = new CreateTodoControllerImplementation(
      todoValidator,
      taskValidator,
      createTodoUseCase
    )
    const foundUser = await findUserByIdService.execute(userId)
    // Given
    expectsValidRequest(request)
    expect(connection.query).toHaveBeenCalledTimes(1)
    expect(foundUser).toBeNull()
    // When
    const controllerResponse = await createTodoController.execute(request)
    // Then
    expect(connection.query).toHaveBeenCalledTimes(2)
    expectsControllerResponse400AndMessage(controllerResponse)
    expect(controllerResponse.body).toContain(UserNotFoundByIdError.message)
  })

  test("Valid request and user found. But task not found by body.taskId => 400/message", async () => {
    const mockQuery = jest
      .fn()
      .mockReturnValueOnce([userDB])
      .mockReturnValueOnce([])
      .mockReturnValueOnce([userDB])
      .mockReturnValueOnce([])
    const connection = MockConnectionAcceptQuery(mockQuery)()
    const findUserByIdService = new PostgresFindUserByIdService(connection)
    const findTaskByIdService = new PostgresFindTaskByIdService(connection)
    const createTodoUseCase = new CreateTodoUseCaseImplementation(
      findUserByIdService,
      findTaskByIdService,
      createTodoService
    )
    const createTodoController = new CreateTodoControllerImplementation(
      todoValidator,
      taskValidator,
      createTodoUseCase
    )
    const foundUser = await findUserByIdService.execute(userId)
    const foundTask = await findTaskByIdService.execute(taskId)
    // Given
    expectsValidRequest(request)
    expect(connection.query).toHaveBeenCalledTimes(2)
    expect(foundUser).toEqual(foundUserFromService)
    expect(foundTask).toBeNull()
    // When
    const controllerResponse = await createTodoController.execute(request)
    // Then
    expect(connection.query).toHaveBeenCalledTimes(4)
    expectsControllerResponse400AndMessage(controllerResponse)
    expect(controllerResponse.body).toContain(TaskNotFoundByIdError.message)
  })

  test("Valid request, user found and task found => 201", async () => {
    const mockQuery = jest
      .fn()
      .mockReturnValueOnce([userDB])
      .mockReturnValueOnce([taskDB])
      .mockReturnValueOnce([userDB])
      .mockReturnValueOnce([taskDB])
    const connection = MockConnectionAcceptQuery(mockQuery)()
    const findUserByIdService = new PostgresFindUserByIdService(connection)
    const findTaskByIdService = new PostgresFindTaskByIdService(connection)
    const createTodoUseCase = new CreateTodoUseCaseImplementation(
      findUserByIdService,
      findTaskByIdService,
      createTodoService
    )
    const createTodoController = new CreateTodoControllerImplementation(
      todoValidator,
      taskValidator,
      createTodoUseCase
    )
    const foundUser = await findUserByIdService.execute(userId)
    const foundTask = await findTaskByIdService.execute(taskId)
    // Given
    expectsValidRequest(request)
    expect(connection.query).toHaveBeenCalledTimes(2)
    expect(foundUser).toEqual(foundUserFromService)
    expect(foundTask).toEqual(foundTaskFromService)
    // When
    const controllerResponse = await createTodoController.execute(request)
    // Then
    expect(connection.query).toHaveBeenCalledTimes(4)
    expect(connection.mutate).toHaveBeenCalledTimes(1)
    expect(controllerResponse.status).toBe(201)
    expect(controllerResponse.body).toBeUndefined()
  })
})
