import { UpdateTaskBody } from "../../../../../src/domain/types/request/body.types"
import { AdaptedRequest } from "../../../../../src/domain/types/router.types"

import TaskValidatorImplementation from "../../../../../src/domain/validators/implementations/task.validator"
import PostgresFindUserByIdService from "../../../../../src/domain/services/users/implementations/postgres-find-user-by-id.service"
import PostgresFindTaskByIdService from "../../../../../src/domain/services/tasks/implementations/postgres-find-task-by-id.service"
import PostgresUpdateTaskService from "../../../../../src/domain/services/tasks/implementations/postgres-update-task.service"
import UpdateTaskUseCaseImplementation from "../../../../../src/domain/usecases/tasks/implementations/update-task.usecase"
import UpdateTaskControllerImplementation from "../../../../../src/domain/controllers/tasks/implementations/update-task.controller"

import MissingRequestBodyError from "../../../../../src/domain/errors/controllers/missing-request-body.error"
import MissingRequestAuthTokenError from "../../../../../src/domain/errors/controllers/missing-request-auth-token.error"
import MissingRequestParamsError from "../../../../../src/domain/errors/controllers/missing-request-params.error"
import UserNotFoundByIdError from "../../../../../src/domain/errors/users/user-not-found-by-id.error"
import TaskNotFoundByIdError from "../../../../../src/domain/errors/tasks/task-not-found-by-id.error"

import FakeTaskService from "../../../../utils/fakes/task-service.fake"
import FakeUserService from "../../../../utils/fakes/user-service.fake"
import FakeTokenService from "../../../../utils/fakes/token-service.fake"
import {
  expectsControllerResponse400AndMessage,
  expectsControllerResponse401AndMessage
} from "../../../../utils/functions/expects.functions"
import MockConnection, {
  MockConnectionAcceptQuery
} from "../../../../utils/mocks/domain/database/database-connection.mock"

const userId = FakeUserService.getValidUserId()
const taskId = FakeTaskService.getValidTaskId()
const token = FakeTokenService.getValid(userId)
const authToken = FakeTokenService.decode(token)
const userDB = FakeUserService.getUserDB("1", userId)
const foundUserFromService = FakeUserService.getUserFromService(userDB)
const taskDB = FakeTaskService.getTaskDB("1", userId, taskId)
const foundTaskFromService = FakeTaskService.getTaskFromService(taskDB)

const taskValidator = new TaskValidatorImplementation()
const connection = MockConnection()
const findUserByIdService = new PostgresFindUserByIdService(connection)
const findTaskByIdService = new PostgresFindTaskByIdService(connection)
const updateTaskService = new PostgresUpdateTaskService(connection)
const updateTaskUseCase = new UpdateTaskUseCaseImplementation(
  findUserByIdService,
  findTaskByIdService,
  updateTaskService
)
const updateTaskController = new UpdateTaskControllerImplementation(
  taskValidator,
  updateTaskUseCase
)

let request: AdaptedRequest<UpdateTaskBody>

beforeEach(() => {
  const adaptedRequest = {
    body: {
      name: "Task Name Updated",
      description: "Task Description Updated"
    },
    authToken,
    params: { taskId }
  }
  request = { ...adaptedRequest }
})

describe("UpdateTaskControllerImplementation", () => {
  test("Null body => 400/message", async () => {
    request.body = null
    // Given
    expect(request.body).toBeNull()
    // When
    const controllerResponse = await updateTaskController.execute(request)
    // Then
    expectsControllerResponse400AndMessage(controllerResponse)
    expect(controllerResponse.body).toContain(MissingRequestBodyError.message)
  })

  test("Invalid body.name => 400/message", async () => {
    // @ts-ignore
    request.body.name = 123
    const nameValidationMessage = taskValidator.getMessageForName(request.body.name)
    // Given
    expect(nameValidationMessage).not.toBeNull()
    // When
    const controllerResponse = await updateTaskController.execute(request)
    // Then
    expectsControllerResponse400AndMessage(controllerResponse)
    expect(controllerResponse.body).toContain(nameValidationMessage)
  })

  test("Invalid body.description => 400/message", async () => {
    // @ts-ignore
    request.body.description = 123
    const descriptionValidationMessage = taskValidator.getMessageForDescription(
      request.body.description
    )
    // Given
    expect(descriptionValidationMessage).not.toBeNull()
    // When
    const controllerResponse = await updateTaskController.execute(request)
    // Then
    expectsControllerResponse400AndMessage(controllerResponse)
    expect(controllerResponse.body).toContain(descriptionValidationMessage)
  })

  test("Null authToken => 401/message", async () => {
    request.authToken = null
    // Given
    expect(request.authToken).toBeNull()
    // When
    const controllerResponse = await updateTaskController.execute(request)
    // Then
    expectsControllerResponse401AndMessage(controllerResponse)
    expect(controllerResponse.body).toContain(MissingRequestAuthTokenError.message)
  })

  test("Null params => 400/message", async () => {
    request.params = null
    // Given
    expect(request.params).toBeNull()
    // When
    const controllerResponse = await updateTaskController.execute(request)
    // Then
    expectsControllerResponse400AndMessage(controllerResponse)
    expect(controllerResponse.body).toContain(MissingRequestParamsError.message)
  })

  test("Invalid taskId params => 400/message", async () => {
    // @ts-ignore
    request.params.taskId = 123
    const paramsValidationMessage = taskValidator.getMessageForId(request.params.taskId)
    // Given
    expect(paramsValidationMessage).not.toBeNull()
    // When
    const controllerResponse = await updateTaskController.execute(request)
    // Then
    expectsControllerResponse400AndMessage(controllerResponse)
    expect(controllerResponse.body).toContain(paramsValidationMessage)
  })

  test("Valid request. But user not found by authToken userId => 400/message", async () => {
    const { connection, foundUser, updateTaskController } = await setupUserNotFound()
    // Given
    expectsValidRequest(request)
    expect(connection.query).toHaveBeenCalledTimes(1)
    expect(foundUser).toBeNull()
    // When
    const controllerResponse = await updateTaskController.execute(request)
    // Then
    expect(connection.query).toHaveBeenCalledTimes(2)
    expectsControllerResponse400AndMessage(controllerResponse)
    expect(controllerResponse.body).toContain(UserNotFoundByIdError.message)
  })

  test("Valid request and user found. But task not found by param taskId => 400/message", async () => {
    const { connection, foundUser, foundTask, updateTaskController } =
      await setupUserFoundButTaskNotFound()
    // Given
    expectsValidRequest(request)
    expect(connection.query).toHaveBeenCalledTimes(2)
    expect(foundUser).toEqual(foundUserFromService)
    expect(foundTask).toBeNull()
    // When
    const controllerResponse = await updateTaskController.execute(request)
    // Then
    expect(connection.query).toHaveBeenCalledTimes(4)
    expectsControllerResponse400AndMessage(controllerResponse)
    expect(controllerResponse.body).toContain(TaskNotFoundByIdError.message)
  })

  test("Valid request and user found and task found => 204", async () => {
    const { connection, foundUser, foundTask, updateTaskController } = await setupUserAndTaskFound()
    // Given
    expectsValidRequest(request)
    expect(connection.query).toHaveBeenCalledTimes(2)
    expect(foundUser).toEqual(foundUserFromService)
    expect(foundTask).toEqual(foundTaskFromService)
    // When
    const controllerResponse = await updateTaskController.execute(request)
    // Then
    expect(connection.query).toHaveBeenCalledTimes(4)
    expect(controllerResponse.status).toBe(204)
    expect(controllerResponse.body).toBeUndefined()
  })
})

async function setupUserAndTaskFound() {
  const mockQuery = jest
    .fn()
    .mockReturnValueOnce([userDB])
    .mockReturnValueOnce([taskDB])
    .mockReturnValueOnce([userDB])
    .mockReturnValueOnce([taskDB])
  const connection = MockConnectionAcceptQuery(mockQuery)()
  const findUserByIdService = new PostgresFindUserByIdService(connection)
  const findTaskByIdService = new PostgresFindTaskByIdService(connection)
  const updateTaskUseCase = new UpdateTaskUseCaseImplementation(
    findUserByIdService,
    findTaskByIdService,
    updateTaskService
  )
  const updateTaskController = new UpdateTaskControllerImplementation(
    taskValidator,
    updateTaskUseCase
  )
  const foundUser = await findUserByIdService.execute(userId)
  const foundTask = await findTaskByIdService.execute(taskId)
  return { connection, foundUser, foundTask, updateTaskController }
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
  const updateTaskUseCase = new UpdateTaskUseCaseImplementation(
    findUserByIdService,
    findTaskByIdService,
    updateTaskService
  )
  const updateTaskController = new UpdateTaskControllerImplementation(
    taskValidator,
    updateTaskUseCase
  )
  const foundUser = await findUserByIdService.execute(userId)
  const foundTask = await findTaskByIdService.execute(taskId)
  return { connection, foundUser, foundTask, updateTaskController }
}

async function setupUserNotFound() {
  const mockQuery = jest.fn().mockReturnValueOnce([]).mockReturnValueOnce([])
  const connection = MockConnectionAcceptQuery(mockQuery)()
  const findUserByIdService = new PostgresFindUserByIdService(connection)
  const updateTaskUseCase = new UpdateTaskUseCaseImplementation(
    findUserByIdService,
    findTaskByIdService,
    updateTaskService
  )
  const updateTaskController = new UpdateTaskControllerImplementation(
    taskValidator,
    updateTaskUseCase
  )
  const foundUser = await findUserByIdService.execute(userId)
  return { connection, foundUser, updateTaskController }
}

function expectsValidRequest(request: any) {
  const nameValidationMessage = taskValidator.getMessageForName(request.body.name)
  expect(nameValidationMessage).toBeNull()
  const descriptionValidationMessage = taskValidator.getMessageForDescription(
    request.body.description
  )
  expect(descriptionValidationMessage).toBeNull()
  const taskIdValidationdMessage = taskValidator.getMessageForId(request.params.taskId)
  expect(taskIdValidationdMessage).toBeNull()
  expect(request.authToken.userId).toBeString()
  expect(request.authToken.userId).toBeTruthy()
}
