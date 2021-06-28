import "jest-extended"

import PostgresDeleteTaskService from "../../../../../src/domain/services/tasks/implementations/postgres-delete-task.service"
import PostgresFindTaskByIdService from "../../../../../src/domain/services/tasks/implementations/postgres-find-task-by-id.service"
import PostgresFindUserByIdService from "../../../../../src/domain/services/users/implementations/postgres-find-user-by-id.service"
import DeleteTaskUseCaseImplementation from "../../../../../src/domain/usecases/tasks/implementations/delete-task.usecase"

import UserNotFoundByIdError from "../../../../../src/domain/errors/users/user-not-found-by-id.error"
import TaskNotFoundByIdError from "../../../../../src/domain/errors/tasks/task-not-found-by-id.error"

import FakeTaskService from "../../../../utils/fakes/task-service.fake"
import FakeUserService from "../../../../utils/fakes/user-service.fake"
import { getError } from "../../../../utils/functions/error.functions"
import { expectsToHaveError } from "../../../../utils/functions/expects.functions"
import { MockConnectionAcceptQuery } from "../../../../utils/mocks/domain/database/database-connection.mock"
import { TaskTableDto } from "../../../../../src/domain/types/task.types"

const userId = FakeUserService.getValidUserId()
const taskId = FakeTaskService.getValidTaskId()
const userDB = { id: userId, name: "User Name", email: "user@mail.com", password_hash: "user_hash" }
const taskDB = { id: taskId, name: "Task Name", description: "Task Description", user_id: userId }

describe("DeleteTaskUseCaseImplementation | execute", () => {
  test("User not found by id. Then throw UserNotFoundByIdError", async () => {
    const mockQuery = jest.fn().mockReturnValueOnce([]).mockReturnValueOnce([])
    const connection = MockConnectionAcceptQuery(mockQuery)()
    const findUserByIdService = new PostgresFindUserByIdService(connection)
    const findTaskByIdService = new PostgresFindTaskByIdService(connection)
    const deleteTaskService = new PostgresDeleteTaskService(connection)
    const deleteTaskUseCase = new DeleteTaskUseCaseImplementation(
      findUserByIdService,
      findTaskByIdService,
      deleteTaskService
    )
    const foundUser = await findUserByIdService.execute(userId)
    // Given
    expect(foundUser).toBeNull()
    expect(connection.query).toHaveBeenCalledTimes(1)
    // When
    const useCaseErr = await getError(() => deleteTaskUseCase.execute(userId, taskId))
    // Then
    expectsToHaveError(useCaseErr, UserNotFoundByIdError)
    expect(connection.query).toHaveBeenCalledTimes(2)
  })

  test("User found. But task not found by id. Thne throw TaskNotFoundByIdError", async () => {
    // Setup
    const mockQuery = jest
      .fn()
      .mockReturnValueOnce([userDB])
      .mockReturnValueOnce([])
      .mockReturnValueOnce([userDB])
      .mockReturnValueOnce([])
    const connection = MockConnectionAcceptQuery(mockQuery)()
    const findUserByIdService = new PostgresFindUserByIdService(connection)
    const findTaskByIdService = new PostgresFindTaskByIdService(connection)
    const deleteTaskService = new PostgresDeleteTaskService(connection)
    const deleteTaskUseCase = new DeleteTaskUseCaseImplementation(
      findUserByIdService,
      findTaskByIdService,
      deleteTaskService
    )
    // Given values
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
    expect(connection.query).toHaveBeenCalledTimes(2)
    // When
    const useCaseErr = await getError(() => deleteTaskUseCase.execute(userId, taskId))
    // Then
    expectsToHaveError(useCaseErr, TaskNotFoundByIdError)
    expect(connection.query).toHaveBeenCalledTimes(4)
  })

  test("User found and task found throws no errors", async () => {
    const mockQuery = jest.fn().mockReturnValueOnce([userDB]).mockReturnValueOnce([taskDB])
    const connection = MockConnectionAcceptQuery(mockQuery)()
    const findUserByIdService = new PostgresFindUserByIdService(connection)
    const findTaskByIdService = new PostgresFindTaskByIdService(connection)
    const deleteTaskService = new PostgresDeleteTaskService(connection)
    const deleteTaskUseCase = new DeleteTaskUseCaseImplementation(
      findUserByIdService,
      findTaskByIdService,
      deleteTaskService
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
    expect(connection.query).toHaveBeenCalledTimes(2)
    mockQuery.mockClear().mockReturnValueOnce([userDB]).mockReturnValueOnce([taskDB])
    // When
    const useCaseErr = await getError(() => deleteTaskUseCase.execute(userId, taskId))
    // Then
    expect(useCaseErr).toBeFalsy()
    expect(connection.query).toHaveBeenCalledTimes(2)
    expect(connection.mutate).toHaveBeenCalledTimes(1)
    expect(connection.mutate).toHaveBeenCalledAfter(connection.query)
  })
})
