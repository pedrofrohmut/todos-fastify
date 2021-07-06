import { AdaptedRequest } from "../../../../../src/domain/types/router.types"
import { UserDto, UserTableDto } from "../../../../../src/domain/types/user.types"
import { TaskDto, TaskTableDto } from "../../../../../src/domain/types/task.types"

import TaskValidatorImplementation from "../../../../../src/domain/validators/implementations/task.validator"
import PostgresFindUserByIdService from "../../../../../src/domain/services/users/implementations/postgres-find-user-by-id.service"
import PostgresFindTaskByIdService from "../../../../../src/domain/services/tasks/implementations/postgres-find-task-by-id.service"
import FindTaskByIdUseCaseImplementation from "../../../../../src/domain/usecases/tasks/implementations/find-task-by-id.usecase"
import FindTaskByIdControllerImplementation from "../../../../../src/domain/controllers/tasks/implementations/find-task-by-id.controller"

import MissingRequestParamsError from "../../../../../src/domain/errors/controllers/missing-request-params.error"
import MissingRequestAuthTokenError from "../../../../../src/domain/errors/controllers/missing-request-auth-token.error"
import UserNotFoundByIdError from "../../../../../src/domain/errors/users/user-not-found-by-id.error"
import TaskNotFoundByIdError from "../../../../../src/domain/errors/tasks/task-not-found-by-id.error"

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

const userId = FakeUserService.getValidUserId()
const token = FakeTokenService.getValid(userId)
const authToken = FakeTokenService.decode(token)
const taskId = FakeTaskService.getValidTaskId()
const userDB: UserTableDto = {
  id: userId,
  name: "User Name",
  email: "user@mail.com",
  password_hash: "user_hash"
}
const foundUserFromService: UserDto = {
  id: userId,
  name: userDB.name,
  email: userDB.email,
  passwordHash: userDB.password_hash
}
const taskDB: TaskTableDto = {
  id: taskId,
  name: "Task Name",
  description: "Task Description",
  user_id: userId
}
const foundTaskFromService: TaskDto = {
  id: taskId,
  name: taskDB.name,
  description: taskDB.description,
  userId
}

const connection = MockConnection()
const taskValidator = new TaskValidatorImplementation()
const findUserByIdService = new PostgresFindUserByIdService(connection)
const findTaskByIdService = new PostgresFindTaskByIdService(connection)
const findTaskByIdUseCase = new FindTaskByIdUseCaseImplementation(
  findUserByIdService,
  findTaskByIdService
)
const findTaskByIdController = new FindTaskByIdControllerImplementation(
  taskValidator,
  findTaskByIdUseCase
)

let request: AdaptedRequest<null>

beforeEach(() => {
  const adaptedRequest = {
    body: null,
    authToken,
    params: { taskId }
  }
  request = { ...adaptedRequest }
})

describe("FindTaskByIdControllerImplementation", () => {
  test("Null params => 400/message", async () => {
    request.params = null
    // Given
    expect(request.params).toBeNull()
    // When
    const controllerResponse = await findTaskByIdController.execute(request)
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
    const controllerResponse = await findTaskByIdController.execute(request)
    // Then
    expectsControllerResponse400AndMessage(controllerResponse)
    expect(controllerResponse.body).toContain(taskIdValidationMessage)
  })

  test("Null authToken => 401/message", async () => {
    request.authToken = null
    // Given
    expect(request.authToken).toBeNull()
    // When
    const controllerResponse = await findTaskByIdController.execute(request)
    // Then
    expectsControllerResponse401AndMessage(controllerResponse)
    expect(controllerResponse.body).toContain(MissingRequestAuthTokenError.message)
  })

  test("User not found by token userId => 400/message", async () => {
    const mockQuery = jest.fn().mockReturnValueOnce([]).mockReturnValueOnce([])
    const connection = MockConnectionAcceptQuery(mockQuery)()
    const findUserByIdService = new PostgresFindUserByIdService(connection)
    const findTaskByIdUseCase = new FindTaskByIdUseCaseImplementation(
      findUserByIdService,
      findTaskByIdService
    )
    const findTaskByIdController = new FindTaskByIdControllerImplementation(
      taskValidator,
      findTaskByIdUseCase
    )
    const foundUser = await findUserByIdService.execute(request.authToken.userId)
    // Given
    expect(connection.query).toHaveBeenCalledTimes(1)
    expect(foundUser).toBeNull()
    // When
    const controllerResponse = await findTaskByIdController.execute(request)
    // Then
    expect(connection.query).toHaveBeenCalledTimes(2)
    expectsControllerResponse400AndMessage(controllerResponse)
    expect(controllerResponse.body).toContain(UserNotFoundByIdError.message)
  })

  test("User found. but task not found => 400/message", async () => {
    const mockQuery = jest
      .fn()
      .mockReturnValueOnce([userDB])
      .mockReturnValueOnce([])
      .mockReturnValueOnce([userDB])
      .mockReturnValueOnce([])
    const connection = MockConnectionAcceptQuery(mockQuery)()
    const findUserByIdService = new PostgresFindUserByIdService(connection)
    const findTaskByIdService = new PostgresFindTaskByIdService(connection)
    const findTaskByIdUseCase = new FindTaskByIdUseCaseImplementation(
      findUserByIdService,
      findTaskByIdService
    )
    const findTaskByIdController = new FindTaskByIdControllerImplementation(
      taskValidator,
      findTaskByIdUseCase
    )
    const foundUser = await findUserByIdService.execute(request.authToken.userId)
    const foundTask = await findTaskByIdService.execute(request.params.taskId)
    // Given
    expect(connection.query).toHaveBeenCalledTimes(2)
    expect(foundUser).toEqual(foundUserFromService)
    expect(foundTask).toBeNull()
    // When
    const controllerResponse = await findTaskByIdController.execute(request)
    // Then
    expect(connection.query).toHaveBeenCalledTimes(4)
    expectsControllerResponse400AndMessage(controllerResponse)
    expect(controllerResponse.body).toContain(TaskNotFoundByIdError.message)
  })

  test("User found and task found => 200/Task", async () => {
    const mockQuery = jest
      .fn()
      .mockReturnValueOnce([userDB])
      .mockReturnValueOnce([taskDB])
      .mockReturnValueOnce([userDB])
      .mockReturnValueOnce([taskDB])
    const connection = MockConnectionAcceptQuery(mockQuery)()
    const findUserByIdService = new PostgresFindUserByIdService(connection)
    const findTaskByIdService = new PostgresFindTaskByIdService(connection)
    const findTaskByIdUseCase = new FindTaskByIdUseCaseImplementation(
      findUserByIdService,
      findTaskByIdService
    )
    const findTaskByIdController = new FindTaskByIdControllerImplementation(
      taskValidator,
      findTaskByIdUseCase
    )
    const foundUser = await findUserByIdService.execute(request.authToken.userId)
    const foundTask = await findTaskByIdService.execute(request.params.taskId)
    // Given
    expect(connection.query).toHaveBeenCalledTimes(2)
    expect(foundUser).toEqual(foundUserFromService)
    expect(foundTask).toEqual(foundTaskFromService)
    // When
    const controllerResponse = await findTaskByIdController.execute(request)
    // Then
    expect(connection.query).toHaveBeenCalledTimes(4)
    expect(controllerResponse.status).toBe(200)
    expect(controllerResponse.body).toEqual(foundTaskFromService)
  })
})
