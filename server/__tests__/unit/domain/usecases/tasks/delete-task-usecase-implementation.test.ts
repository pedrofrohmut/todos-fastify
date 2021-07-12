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
import {
  MockConnectionAcceptQuery,
  MockConnectionAcceptQueryAndMutate
} from "../../../../utils/mocks/domain/database/database-connection.mock"

const userId = FakeUserService.getValidUserId()
const taskId = FakeTaskService.getValidTaskId()
const userDB = { id: userId, name: "User Name", email: "user@mail.com", password_hash: "user_hash" }
const foundUserFromService = FakeUserService.getUserFromService(userDB)
const taskDB = { id: taskId, name: "Task Name", description: "Task Description", user_id: userId }
const foundTaskFromService = FakeTaskService.getTaskFromService(taskDB)

describe("DeleteTaskUseCaseImplementation | execute", () => {
  test("User not found by id throws UserNotFoundByIdError", async () => {
    const { foundUser, connection, deleteTaskUseCase } = await setupUserNotFound()
    // Given
    expect(connection.query).toHaveBeenCalledTimes(1)
    expect(foundUser).toBeNull()
    // When
    const useCaseErr = await getError(() => deleteTaskUseCase.execute(userId, taskId))
    // Then
    expect(connection.query).toHaveBeenCalledTimes(2)
    expect(connection.mutate).not.toHaveBeenCalled()
    expectsToHaveError(useCaseErr, UserNotFoundByIdError)
    expect(useCaseErr.message).toContain(UserNotFoundByIdError.message)
  })

  test("User found. But task not found by id throws TaskNotFoundByIdError", async () => {
    const { foundUser, foundTask, connection, deleteTaskUseCase } =
      await setupUserFoundButTaskNotFound()
    // Given
    expect(connection.query).toHaveBeenCalledTimes(2)
    expect(foundUser).toEqual(foundUserFromService)
    expect(foundTask).toBeNull()
    // When
    const useCaseErr = await getError(() => deleteTaskUseCase.execute(userId, taskId))
    // Then
    expect(connection.query).toHaveBeenCalledTimes(4)
    expect(connection.mutate).not.toHaveBeenCalled()
    expectsToHaveError(useCaseErr, TaskNotFoundByIdError)
    expect(useCaseErr.message).toContain(TaskNotFoundByIdError.message)
  })

  test("User and task found. But error to deleteTask throws errors", async () => {
    const { connection, foundUser, foundTask, deleteErr, deleteTaskUseCase } =
      await setupUserAndTaskFoundButErrorToDelete()
    // Given
    expect(connection.query).toHaveBeenCalledTimes(2)
    expect(connection.mutate).toHaveBeenCalledTimes(1)
    expect(foundUser).toEqual(foundUserFromService)
    expect(foundTask).toEqual(foundTaskFromService)
    expectsToHaveError(deleteErr)
    // When
    const useCaseErr = await getError(() => deleteTaskUseCase.execute(userId, taskId))
    // Then
    expect(connection.query).toHaveBeenCalledTimes(4)
    expect(connection.mutate).toHaveBeenCalledTimes(2)
    expectsToHaveError(useCaseErr)
  })

  test("User and task found and no errors to deleteTask throws no errors", async () => {
    const { deleteErr, foundUser, foundTask, connection, deleteTaskUseCase } =
      await setupUserFoundAndTaskFound()
    // Given
    expect(connection.query).toHaveBeenCalledTimes(2)
    expect(connection.mutate).toHaveBeenCalledTimes(1)
    expect(foundUser).toEqual(foundUserFromService)
    expect(foundTask).toEqual(foundTaskFromService)
    expect(deleteErr).toBeFalsy()
    // When
    const useCaseErr = await getError(() => deleteTaskUseCase.execute(userId, taskId))
    // Then
    expect(connection.query).toHaveBeenCalledTimes(4)
    expect(connection.mutate).toHaveBeenCalledTimes(2)
    expect(useCaseErr).toBeFalsy()
  })
})

async function setupUserAndTaskFoundButErrorToDelete() {
  const mockQuery = jest
    .fn()
    .mockReturnValueOnce([userDB])
    .mockReturnValueOnce([taskDB])
    .mockReturnValueOnce([userDB])
    .mockReturnValueOnce([taskDB])
  const mockMutate = jest.fn(() => {
    throw new Error("Mock Error Mutate")
  })
  const connection = MockConnectionAcceptQueryAndMutate(mockQuery, mockMutate)()
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
  const deleteErr = await getError(() => deleteTaskService.execute(taskId))
  return { connection, foundUser, foundTask, deleteErr, deleteTaskUseCase }
}

async function setupUserFoundAndTaskFound() {
  const mockQuery = jest
    .fn()
    .mockReturnValueOnce([userDB])
    .mockReturnValueOnce([taskDB])
    .mockReturnValueOnce([userDB])
    .mockReturnValueOnce([taskDB])
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
  const deleteErr = await getError(() => deleteTaskService.execute(taskId))
  return { deleteErr, foundUser, foundTask, connection, deleteTaskUseCase }
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
  const deleteTaskService = new PostgresDeleteTaskService(connection)
  const deleteTaskUseCase = new DeleteTaskUseCaseImplementation(
    findUserByIdService,
    findTaskByIdService,
    deleteTaskService
  )
  // Given values
  const foundUser = await findUserByIdService.execute(userId)
  const foundTask = await findTaskByIdService.execute(taskId)
  return { foundUser, foundTask, connection, deleteTaskUseCase }
}

async function setupUserNotFound() {
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
  return { foundUser, connection, deleteTaskUseCase }
}
