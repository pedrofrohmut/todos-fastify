import PostgresFindUserByIdService from "../../../../../src/domain/services/users/implementations/postgres-find-user-by-id.service"
import PostgresFindTaskByIdService from "../../../../../src/domain/services/tasks/implementations/postgres-find-task-by-id.service"
import FindTaskByIdUseCaseImplementation from "../../../../../src/domain/usecases/tasks/implementations/find-task-by-id.usecase"

import UserNotFoundByIdError from "../../../../../src/domain/errors/users/user-not-found-by-id.error"
import TaskNotFoundByIdError from "../../../../../src/domain/errors/tasks/task-not-found-by-id.error"

import FakeUserService from "../../../../utils/fakes/user-service.fake"
import { getError } from "../../../../utils/functions/error.functions"
import { expectsToHaveError } from "../../../../utils/functions/expects.functions"
import { MockConnectionAcceptQuery } from "../../../../utils/mocks/domain/database/database-connection.mock"
import FakeTaskService from "../../../../utils/fakes/task-service.fake"
import { UserTableDto } from "../../../../../src/domain/types/user.types"
import { TaskTableDto } from "../../../../../src/domain/types/task.types"

const userId = FakeUserService.getValidUserId()
const taskId = FakeTaskService.getValidTaskId()
const userDB: UserTableDto = {
  id: userId,
  name: "User Name",
  email: "user@mail.com",
  password_hash: "user_hash"
}
const taskDB: TaskTableDto = {
  id: taskId,
  name: "Task Name",
  description: "Task Description",
  user_id: userId
}

describe("FindTaskByIdUseCaseImplementation", () => {
  test("User not found throw UserNotFoundByIdError", async () => {
    const mockQuery = jest.fn().mockReturnValueOnce([]).mockReturnValueOnce([])
    const connection = MockConnectionAcceptQuery(mockQuery)()
    const findUserByIdService = new PostgresFindUserByIdService(connection)
    const findTaskByIdService = new PostgresFindTaskByIdService(connection)
    const findTaskByIdUseCase = new FindTaskByIdUseCaseImplementation(
      findUserByIdService,
      findTaskByIdService
    )
    const foundUser = await findUserByIdService.execute(userId)
    // Given
    expect(connection.query).toHaveBeenCalledTimes(1)
    expect(foundUser).toBeNull()
    // When
    const useCaseErr = await getError(() => findTaskByIdUseCase.execute(userId, taskId))
    // Then
    expect(connection.query).toHaveBeenCalledTimes(2)
    expectsToHaveError(useCaseErr, UserNotFoundByIdError)
  })

  test("User found. But Task not found throw TaskNotFoundByIdError", async () => {
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
    const foundUser = await findUserByIdService.execute(userId)
    const foundTask = await findTaskByIdService.execute(taskId)
    // Given
    expect(connection.query).toHaveBeenCalledTimes(2)
    expect(foundUser).toEqual({
      id: userId,
      name: userDB.name,
      email: userDB.email,
      passwordHash: userDB.password_hash
    })
    expect(foundTask).toBeNull()
    // When
    const useCaseErr = await getError(() => findTaskByIdUseCase.execute(userId, taskId))
    // Then
    expect(connection.query).toHaveBeenCalledTimes(4)
    expectsToHaveError(useCaseErr, TaskNotFoundByIdError)
  })

  test("User found. Task found => TaskDto", async () => {
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
    const foundUser = await findUserByIdService.execute(userId)
    const foundTask = await findTaskByIdService.execute(taskId)
    // Given
    expect(connection.query).toHaveBeenCalledTimes(2)
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
    const foundTaskUseCase = await findTaskByIdUseCase.execute(userId, taskId)
    // Then
    expect(connection.query).toHaveBeenCalledTimes(4)
    expect(foundTaskUseCase).toEqual({
      id: taskId,
      name: taskDB.name,
      description: taskDB.description,
      userId
    })
  })
})
