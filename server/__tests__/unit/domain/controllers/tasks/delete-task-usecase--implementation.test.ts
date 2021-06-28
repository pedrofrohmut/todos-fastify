import PostgresFindUserByIdService from "../../../../../src/domain/services/users/implementations/postgres-find-user-by-id.service"
import PostgresFindTaskByIdService from "../../../../../src/domain/services/tasks/implementations/postgres-find-task-by-id.service"
import PostgresDeleteTaskService from "../../../../../src/domain/services/tasks/implementations/postgres-delete-task.service"
import DeleteTaskUseCaseImplementation from "../../../../../src/domain/usecases/tasks/implementations/delete-task.usecase"
import TaskValidatorImplementation from "../../../../../src/domain/validators/implementations/task.validator"
import DeleteTaskControllerImplementation from "../../../../../src/domain/controllers/tasks/implementations/delete-task.controller"

import {
  expectsControllerResponse204,
  expectsControllerResponse400AndMessage,
  expectsControllerResponse401AndMessage,
  expectsTruthyMessage
} from "../../../../utils/functions/expects.functions"
import MockConnection, {
  MockConnectionAcceptQuery
} from "../../../../utils/mocks/domain/database/database-connection.mock"
import { AdaptedRequest } from "../../../../../src/domain/types/router.types"
import FakeTokenService from "../../../../utils/fakes/token-service.fake"
import FakeUserService from "../../../../utils/fakes/user-service.fake"
import FakeTaskService from "../../../../utils/fakes/task-service.fake"
import UserNotFoundByIdError from "../../../../../src/domain/errors/users/user-not-found-by-id.error"
import { TaskTableDto } from "../../../../../src/domain/types/task.types"
import { UserTableDto } from "../../../../../src/domain/types/user.types"

const connection = MockConnection()
const taskValidator = new TaskValidatorImplementation()
const findUserByIdService = new PostgresFindUserByIdService(connection)
const findTaskByIdService = new PostgresFindTaskByIdService(connection)
const deleteTaskService = new PostgresDeleteTaskService(connection)
const deleteTaskUseCase = new DeleteTaskUseCaseImplementation(
  findUserByIdService,
  findTaskByIdService,
  deleteTaskService
)
const deleteTaskController = new DeleteTaskControllerImplementation(
  taskValidator,
  deleteTaskUseCase
)

const userId = FakeUserService.getValidUserId()
const token = FakeTokenService.getValid(userId)
const authToken = FakeTokenService.decode(token)
const taskId = FakeTaskService.getValidTaskId()
const taskDB: TaskTableDto = {
  id: taskId,
  name: "Task Name",
  description: "Task Description",
  user_id: userId
}
const userDB: UserTableDto = {
  id: userId,
  name: "User Name",
  email: "user@mail.com",
  password_hash: "user_hash"
}

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

describe("DeleteTaskControllerImplementation", () => {
  test("Null params => 400/message", async () => {
    request.params = null
    // Given
    expect(request.params).toBeNull()
    // When
    const controllerResponse = await deleteTaskController.execute(request)
    // Then
    expectsControllerResponse400AndMessage(controllerResponse)
  })

  test("Invalid taskId => 400/message", async () => {
    request.params.taskId = "123"
    const taskIdValidationMessage = taskValidator.getMessageForId(request.params.taskId)
    // Given
    expectsTruthyMessage(taskIdValidationMessage)
    // When
    const controllerResponse = await deleteTaskController.execute(request)
    // Then
    expectsControllerResponse400AndMessage(controllerResponse)
  })

  test("Null authToken => 401/message", async () => {
    request.authToken = null
    // Given
    expect(request.authToken).toBeNull()
    // When
    const controllerResponse = await deleteTaskController.execute(request)
    // Then
    expectsControllerResponse401AndMessage(controllerResponse)
  })

  test("User not found by id => 400/message", async () => {
    const mockQuery = jest
      .fn()
      .mockReturnValueOnce([])
      .mockReturnValueOnce([])
      .mockReturnValueOnce([taskDB])
    const connection = MockConnectionAcceptQuery(mockQuery)()
    const findUserByIdService = new PostgresFindUserByIdService(connection)
    const deleteTaskUseCase = new DeleteTaskUseCaseImplementation(
      findUserByIdService,
      findTaskByIdService,
      deleteTaskService
    )
    const deleteTaskController = new DeleteTaskControllerImplementation(
      taskValidator,
      deleteTaskUseCase
    )
    const foundUser = await findUserByIdService.execute(userId)
    // Given
    expect(foundUser).toBeNull()
    expect(connection.query).toHaveBeenCalledTimes(1)
    // When
    const controllerResponse = await deleteTaskController.execute(request)
    // Then
    expectsControllerResponse400AndMessage(controllerResponse)
    expect(controllerResponse.body).toContain(UserNotFoundByIdError.message)
    expect(connection.query).toHaveBeenCalledTimes(2)
  })

  test("User found. But task not found by id => 400/message", async () => {
    const mockQuery = jest
      .fn()
      .mockReturnValueOnce([userDB])
      .mockReturnValueOnce([])
      .mockReturnValueOnce([userDB])
      .mockReturnValueOnce([])
    const connection = MockConnectionAcceptQuery(mockQuery)()
    const findUserByIdService = new PostgresFindUserByIdService(connection)
    const findTaskByIdService = new PostgresFindTaskByIdService(connection)
    const deleteTaskUseCase = new DeleteTaskUseCaseImplementation(
      findUserByIdService,
      findTaskByIdService,
      deleteTaskService
    )
    const deleteTaskController = new DeleteTaskControllerImplementation(
      taskValidator,
      deleteTaskUseCase
    )
    const foundUser = await findUserByIdService.execute(userId)
    const foundTask = await findTaskByIdService.execute(taskId)
    // Given
    expect(foundUser).toEqual({
      id: userId,
      name: userDB.name,
      email: userDB.email,
      passwordHash: userDB.password_hash
    })
    expect(foundTask).toBeNull()
    // When
    const controllerResponse = await deleteTaskController.execute(request)
    // Then
    expectsControllerResponse400AndMessage(controllerResponse)
  })

  test("User found. Task found => 204", async () => {
    const mockQuery = jest
      .fn()
      .mockReturnValueOnce([userDB])
      .mockReturnValueOnce([taskDB])
      .mockReturnValueOnce([userDB])
      .mockReturnValueOnce([taskDB])
    const connection = MockConnectionAcceptQuery(mockQuery)()
    const findUserByIdService = new PostgresFindUserByIdService(connection)
    const findTaskByIdService = new PostgresFindTaskByIdService(connection)
    const deleteTaskUseCase = new DeleteTaskUseCaseImplementation(
      findUserByIdService,
      findTaskByIdService,
      deleteTaskService
    )
    const deleteTaskController = new DeleteTaskControllerImplementation(
      taskValidator,
      deleteTaskUseCase
    )
    const foundUser = await findUserByIdService.execute(userId)
    const foundTask = await findTaskByIdService.execute(taskId)
    // Given
    expect(foundUser).toEqual({
      id: userId,
      name: userDB.name,
      email: userDB.email,
      passwordHash: userDB.password_hash
    })
    expect(foundTask).toEqual({
      id: taskId,
      name: taskDB.name,
      description: taskDB.description,
      userId
    })
    // When
    const controllerResponse = await deleteTaskController.execute(request)
    // Then
    expectsControllerResponse204(controllerResponse)
  })
})
