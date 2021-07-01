import { AdaptedRequest } from "../../../../../src/domain/types/router.types"

import UserValidatorImplementation from "../../../../../src/domain/validators/implementations/user.validator"
import PostgresFindTasksByUserIdService from "../../../../../src/domain/services/tasks/implementations/postgres-find-tasks-by-user-id.service"
import PostgresFindUserByIdService from "../../../../../src/domain/services/users/implementations/postgres-find-user-by-id.service"
import FindTasksByUserIdUseCaseImplementation from "../../../../../src/domain/usecases/tasks/implementations/find-tasks-by-user-id.usecase"
import FindTasksByUserIdControllerImplementation from "../../../../../src/domain/controllers/tasks/implementations/find-tasks-by-user-id.controller"

import MissingRequestParamsError from "../../../../../src/domain/errors/controllers/missing-request-params.error"
import MissingRequestAuthTokenError from "../../../../../src/domain/errors/controllers/missing-request-auth-token.error"
import UserIdFromParamsDontMatchTokenError from "../../../../../src/domain/errors/controllers/user-id-from-params-dont-match-token.error"

import FakeUserService from "../../../../utils/fakes/user-service.fake"
import FakeTokenService from "../../../../utils/fakes/token-service.fake"
import {
  expectsControllerResponse400AndMessage,
  expectsControllerResponse401AndMessage
} from "../../../../utils/functions/expects.functions"
import { MockConnectionAcceptQuery } from "../../../../utils/mocks/domain/database/database-connection.mock"
import UserNotFoundByIdError from "../../../../../src/domain/errors/users/user-not-found-by-id.error"
import { TaskDto } from "../../../../../src/domain/types/task.types"
import FakeTaskService from "../../../../utils/fakes/task-service.fake"

const userId = FakeUserService.getValidUserId()
const userDB = FakeUserService.getUserDB("1", userId)
const foundUserFromService = {
  id: userId,
  name: userDB.name,
  email: userDB.email,
  passwordHash: userDB.password_hash
}
const taskDB1 = FakeTaskService.getTaskDB("1", userId)
const taskDB2 = FakeTaskService.getTaskDB("2", userId)
const taskDB3 = FakeTaskService.getTaskDB("3", userId)
const token = FakeTokenService.getValid(userId)
const authToken = FakeTokenService.decode(token)

const userValidator = new UserValidatorImplementation()
const mockQuery = jest.fn()
const connection = MockConnectionAcceptQuery(mockQuery)()
const findUserByIdService = new PostgresFindUserByIdService(connection)
const findTasksByUserIdService = new PostgresFindTasksByUserIdService(connection)
const findTasksByUserIdUseCase = new FindTasksByUserIdUseCaseImplementation(
  findUserByIdService,
  findTasksByUserIdService
)
const findTasksByUserIdController = new FindTasksByUserIdControllerImplementation(
  userValidator,
  findTasksByUserIdUseCase
)

let request: AdaptedRequest<null>

beforeEach(() => {
  const adaptedRequet = {
    body: null,
    authToken,
    params: { userId }
  }
  request = { ...adaptedRequet }
})

describe("FindTasksByUserIdControllerImplementation", () => {
  test("Null params => 400/message", async () => {
    request.params = null
    // Given
    expect(request.params).toBeNull()
    // When
    const controllerResponse = await findTasksByUserIdController.execute(request)
    // Then
    expectsControllerResponse400AndMessage(controllerResponse)
    expect(controllerResponse.body).toContain(MissingRequestParamsError.message)
  })

  test("Invalid params for userId => 400/message", async () => {
    request.params.userId = "123"
    const userIdValidationMessage = userValidator.getMessageForId(request.params.userId)
    // Given
    expect(userIdValidationMessage).not.toBeNull()
    // When
    const controllerResponse = await findTasksByUserIdController.execute(request)
    // Then
    expectsControllerResponse400AndMessage(controllerResponse)
    expect(controllerResponse.body).toContain(userIdValidationMessage)
  })

  test("Null authToken => 401/message", async () => {
    request.authToken = null
    // Given
    expect(request.authToken).toBeNull()
    // When
    const controllerResponse = await findTasksByUserIdController.execute(request)
    // Then
    expectsControllerResponse401AndMessage(controllerResponse)
    expect(controllerResponse.body).toContain(MissingRequestAuthTokenError.message)
  })

  test("AuthToken userId dont match params userId => 401/message", async () => {
    request.params.userId = FakeUserService.getValidUserId()
    // Given
    expect(request.params.userId).not.toBe(request.authToken.userId)
    // When
    const controllerResponse = await findTasksByUserIdController.execute(request)
    // Then
    expectsControllerResponse401AndMessage(controllerResponse)
    expect(controllerResponse.body).toContain(UserIdFromParamsDontMatchTokenError.message)
  })

  test("User not found by id => 400/message", async () => {
    const mockQuery = jest.fn().mockReturnValueOnce([]).mockReturnValueOnce([])
    const connection = MockConnectionAcceptQuery(mockQuery)()
    const findUserByIdService = new PostgresFindUserByIdService(connection)
    const findTasksByUserIdUseCase = new FindTasksByUserIdUseCaseImplementation(
      findUserByIdService,
      findTasksByUserIdService
    )
    const findTasksByUserIdController = new FindTasksByUserIdControllerImplementation(
      userValidator,
      findTasksByUserIdUseCase
    )
    const foundUser = await findUserByIdService.execute(userId)
    // Given
    expect(connection.query).toHaveBeenCalledTimes(1)
    expect(foundUser).toBeNull()
    // When
    const controllerResponse = await findTasksByUserIdController.execute(request)
    // Then
    expect(connection.query).toHaveBeenCalledTimes(2)
    expectsControllerResponse400AndMessage(controllerResponse)
    expect(controllerResponse.body).toContain(UserNotFoundByIdError.message)
  })

  test("User found. But tasks not found by userId => 200/empty Tasks[]", async () => {
    const mockQuery = jest
      .fn()
      .mockReturnValueOnce([userDB])
      .mockReturnValueOnce([])
      .mockReturnValueOnce([userDB])
      .mockReturnValueOnce([])
    const connection = MockConnectionAcceptQuery(mockQuery)()
    const findUserByIdService = new PostgresFindUserByIdService(connection)
    const findTasksByUserIdService = new PostgresFindTasksByUserIdService(connection)
    const findTasksByUserIdUseCase = new FindTasksByUserIdUseCaseImplementation(
      findUserByIdService,
      findTasksByUserIdService
    )
    const findTasksByUserIdController = new FindTasksByUserIdControllerImplementation(
      userValidator,
      findTasksByUserIdUseCase
    )
    const foundUser = await findUserByIdService.execute(userId)
    const foundTasks = await findTasksByUserIdService.execute(userId)
    // Given
    expect(connection.query).toHaveBeenCalledTimes(2)
    expect(foundUser).toEqual(foundUserFromService)
    expect(foundTasks).toBeArrayOfSize(0)
    // When
    const controllerResponse = await findTasksByUserIdController.execute(request)
    // Then
    expect(connection.query).toHaveBeenCalledTimes(4)
    expect(controllerResponse.status).toBe(200)
    expect(controllerResponse.body).toBeArrayOfSize(0)
  })

  test("User found and tasks found => 200/Tasks[] with the same userId", async () => {
    const mockQuery = jest
      .fn()
      .mockReturnValueOnce([userDB])
      .mockReturnValueOnce([taskDB1, taskDB2, taskDB3])
      .mockReturnValueOnce([userDB])
      .mockReturnValueOnce([taskDB1, taskDB2, taskDB3])
    const connection = MockConnectionAcceptQuery(mockQuery)()
    const findUserByIdService = new PostgresFindUserByIdService(connection)
    const findTasksByUserIdService = new PostgresFindTasksByUserIdService(connection)
    const findTasksByUserIdUseCase = new FindTasksByUserIdUseCaseImplementation(
      findUserByIdService,
      findTasksByUserIdService
    )
    const findTasksByUserIdController = new FindTasksByUserIdControllerImplementation(
      userValidator,
      findTasksByUserIdUseCase
    )
    const foundUser = await findUserByIdService.execute(userId)
    const foundTasks = await findTasksByUserIdService.execute(userId)
    // Given
    expect(connection.query).toHaveBeenCalledTimes(2)
    expect(foundUser).toEqual(foundUserFromService)
    expect(foundTasks).toBeArrayOfSize(3)
    // When
    const controllerResponse = await findTasksByUserIdController.execute(request)
    // Then
    expect(connection.query).toHaveBeenCalledTimes(4)
    expect(controllerResponse.status).toBe(200)
    expect(controllerResponse.body).toBeArrayOfSize(3)
    const tasks = controllerResponse.body as TaskDto[]
    tasks.forEach(task => {
      expect(task.userId).toBe(userId)
    })
  })
})
