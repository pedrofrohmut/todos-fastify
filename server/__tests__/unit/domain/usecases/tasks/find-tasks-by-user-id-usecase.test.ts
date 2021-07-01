import PostgresFindUserByIdService from "../../../../../src/domain/services/users/implementations/postgres-find-user-by-id.service"
import PostgresFindTasksByUserIdService from "../../../../../src/domain/services/tasks/implementations/postgres-find-tasks-by-user-id.service"
import FindTasksByUserIdUseCaseImplementation from "../../../../../src/domain/usecases/tasks/implementations/find-tasks-by-user-id.usecase"

import UserNotFoundByIdError from "../../../../../src/domain/errors/users/user-not-found-by-id.error"

import FakeUserService from "../../../../utils/fakes/user-service.fake"
import { expectsToHaveError } from "../../../../utils/functions/expects.functions"
import { MockConnectionAcceptQuery } from "../../../../utils/mocks/domain/database/database-connection.mock"
import { getError } from "../../../../utils/functions/error.functions"
import FakeTaskService from "../../../../utils/fakes/task-service.fake"

const userId = FakeUserService.getValidUserId()
const userDB = FakeUserService.getUserDB("1")
const foundUserFromService = {
  id: userId,
  name: userDB.name,
  email: userDB.email,
  passwordHash: userDB.password_hash
}
const taskDB1 = FakeTaskService.getTaskDB("1", userId)
const taskDB2 = FakeTaskService.getTaskDB("2", userId)
const taskDB3 = FakeTaskService.getTaskDB("3", userId)

describe("FindTasksByUserIdUseCaseImplementation", () => {
  test("User not found throw UserNotFoundByIdError", async () => {
    const mockQuery = jest.fn().mockReturnValueOnce([]).mockReturnValueOnce([])
    const connection = MockConnectionAcceptQuery(mockQuery)()
    const findUserByIdService = new PostgresFindUserByIdService(connection)
    const findTasksByUserIdService = new PostgresFindTasksByUserIdService(connection)
    const findTasksByUserIdUseCase = new FindTasksByUserIdUseCaseImplementation(
      findUserByIdService,
      findTasksByUserIdService
    )
    const foundUser = await findUserByIdService.execute(userId)
    // Given
    expect(connection.query).toHaveBeenCalledTimes(1)
    expect(foundUser).toBeNull()
    // When
    const useCaseErr = await getError(() => findTasksByUserIdUseCase.execute(userId))
    // Then
    expect(connection.query).toHaveBeenCalledTimes(2)
    expectsToHaveError(useCaseErr, UserNotFoundByIdError)
  })

  test("User found. But no tasks found => empty TaskDto[]", async () => {
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
    const foundUser = await findUserByIdService.execute(userId)
    const foundTasks = await findTasksByUserIdService.execute(userId)
    // Given
    expect(connection.query).toHaveBeenCalledTimes(2)
    expect(foundUser).toEqual(foundUserFromService)
    expect(foundTasks).toBeArrayOfSize(0)
    // When
    const foundTasksUseCase = await findTasksByUserIdUseCase.execute(userId)
    // Then
    expect(connection.query).toHaveBeenCalledTimes(4)
    expect(foundTasksUseCase).toBeArrayOfSize(0)
  })

  test("User found and tasks found => TaskDto[] with the same userId", async () => {
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
    const foundUser = await findUserByIdService.execute(userId)
    const foundTasks = await findTasksByUserIdService.execute(userId)
    // Given
    expect(connection.query).toHaveBeenCalledTimes(2)
    expect(foundUser).toEqual(foundUserFromService)
    expect(foundTasks).toBeArrayOfSize(3)
    // When
    const foundTasksUseCase = await findTasksByUserIdUseCase.execute(userId)
    // Then
    expect(connection.query).toHaveBeenCalledTimes(4)
    expect(foundTasksUseCase).toBeArrayOfSize(3)
    foundTasksUseCase.forEach(task => expect(task.userId).toBe(userId))
  })
})
