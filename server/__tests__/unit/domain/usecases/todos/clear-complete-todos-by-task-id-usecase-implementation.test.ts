import PostgresClearCompleteTodosByTaskIdService from "../../../../../src/domain/services/todos/implementations/postgres-clear-complete-todos-by-task-id.service"
import PostgresFindUserByIdService from "../../../../../src/domain/services/users/implementations/postgres-find-user-by-id.service"
import PostgresFindTaskByIdService from "../../../../../src/domain/services/tasks/implementations/postgres-find-task-by-id.service"
import ClearCompleteTodosByTaskIdUseCaseImplementation from "../../../../../src/domain/usecases/todos/implementations/clear-complete-todos-by-task-id.usecase"

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
const userDB = FakeUserService.getUserDB("1", userId)
const foundUserFromService = FakeUserService.getUserFromService(userDB)
const taskDB = FakeTaskService.getTaskDB("1", userId, taskId)
const foundTaskFromService = FakeTaskService.getTaskFromService(taskDB)

describe("ClearCompleteTodosByTaskIdUseCaseImplementation", () => {
  test("User not found throws UserNotFoundByIdError", async () => {
    const { connection, foundUser, clearCompleteTodosByTaskIdUseCase } = await setupUserNotFound()
    // Given
    expect(connection.query).toHaveBeenCalledTimes(1)
    expect(foundUser).toBeNull()
    // When
    const useCaseErr = await getError(() =>
      clearCompleteTodosByTaskIdUseCase.execute(userId, taskId)
    )
    // Then
    expect(connection.query).toHaveBeenCalledTimes(2)
    expect(connection.mutate).not.toHaveBeenCalled()
    expectsToHaveError(useCaseErr, UserNotFoundByIdError)
    expect(useCaseErr.message).toContain(UserNotFoundByIdError.message)
  })

  test("User found. But task not found throws TaskNotFoundByIdError", async () => {
    const { connection, foundUser, foundTask, clearCompleteTodosByTaskIdUseCase } =
      await setupUserFoundButTaskNotFound()
    // Given
    expect(connection.query).toHaveBeenCalledTimes(2)
    expect(foundUser).toEqual(foundUserFromService)
    expect(foundTask).toBeNull()
    // When
    const useCaseErr = await getError(() =>
      clearCompleteTodosByTaskIdUseCase.execute(userId, taskId)
    )
    // Then
    expect(connection.query).toHaveBeenCalledTimes(4)
    expect(connection.mutate).not.toHaveBeenCalled()
    expectsToHaveError(useCaseErr, TaskNotFoundByIdError)
    expect(useCaseErr.message).toContain(TaskNotFoundByIdError.message)
  })

  test("User and task found. But error to deleteTodos throws error", async () => {
    const { connection, foundUser, foundTask, deleteErr, clearCompleteTodosByTaskIdUseCase } =
      await setupUserAndTaskFoundButErrorToDelete()
    // Given
    expect(connection.query).toHaveBeenCalledTimes(2)
    expect(connection.mutate).toHaveBeenCalledTimes(1)
    expect(foundUser).toEqual(foundUserFromService)
    expect(foundTask).toEqual(foundTaskFromService)
    expectsToHaveError(deleteErr)
    // When
    const useCaseErr = await getError(() =>
      clearCompleteTodosByTaskIdUseCase.execute(userId, taskId)
    )
    // Then
    expect(connection.query).toHaveBeenCalledTimes(4)
    expect(connection.mutate).toHaveBeenCalledTimes(2)
    expectsToHaveError(useCaseErr)
  })

  test("User and task found and no error to deleteTodos throws no errors", async () => {
    const { connection, foundUser, foundTask, deleteErr, clearCompleteTodosByTaskIdUseCase } =
      await setupUserAndTaskFoundAndNoErrorToDelete()
    // Given
    expect(connection.query).toHaveBeenCalledTimes(2)
    expect(connection.mutate).toHaveBeenCalledTimes(1)
    expect(foundUser).toEqual(foundUserFromService)
    expect(foundTask).toEqual(foundTaskFromService)
    expect(deleteErr).toBeFalsy()
    // When
    const useCaseErr = await getError(() =>
      clearCompleteTodosByTaskIdUseCase.execute(userId, taskId)
    )
    // Then
    expect(connection.query).toHaveBeenCalledTimes(4)
    expect(connection.mutate).toHaveBeenCalledTimes(2)
    expect(useCaseErr).toBeFalsy()
  })
})

async function setupUserAndTaskFoundAndNoErrorToDelete() {
  const mockQuery = jest
    .fn()
    .mockReturnValueOnce([userDB])
    .mockReturnValueOnce([taskDB])
    .mockReturnValueOnce([userDB])
    .mockReturnValueOnce([taskDB])
  const connection = MockConnectionAcceptQuery(mockQuery)()
  const findUserByIdService = new PostgresFindUserByIdService(connection)
  const findTaskByIdService = new PostgresFindTaskByIdService(connection)
  const clearCompleteTodosByTaskIdService = new PostgresClearCompleteTodosByTaskIdService(
    connection
  )
  const clearCompleteTodosByTaskIdUseCase = new ClearCompleteTodosByTaskIdUseCaseImplementation(
    findUserByIdService,
    findTaskByIdService,
    clearCompleteTodosByTaskIdService
  )
  const foundUser = await findUserByIdService.execute(userId)
  const foundTask = await findTaskByIdService.execute(taskId)
  const deleteErr = await getError(() => clearCompleteTodosByTaskIdService.execute(taskId))
  return { connection, foundUser, foundTask, deleteErr, clearCompleteTodosByTaskIdUseCase }
}

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
  const clearCompleteTodosByTaskIdService = new PostgresClearCompleteTodosByTaskIdService(
    connection
  )
  const clearCompleteTodosByTaskIdUseCase = new ClearCompleteTodosByTaskIdUseCaseImplementation(
    findUserByIdService,
    findTaskByIdService,
    clearCompleteTodosByTaskIdService
  )
  const foundUser = await findUserByIdService.execute(userId)
  const foundTask = await findTaskByIdService.execute(taskId)
  const deleteErr = await getError(() => clearCompleteTodosByTaskIdService.execute(taskId))
  return { connection, foundUser, foundTask, deleteErr, clearCompleteTodosByTaskIdUseCase }
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
  const clearCompleteTodosByTaskIdService = new PostgresClearCompleteTodosByTaskIdService(
    connection
  )
  const clearCompleteTodosByTaskIdUseCase = new ClearCompleteTodosByTaskIdUseCaseImplementation(
    findUserByIdService,
    findTaskByIdService,
    clearCompleteTodosByTaskIdService
  )
  const foundUser = await findUserByIdService.execute(userId)
  const foundTask = await findTaskByIdService.execute(taskId)
  return { connection, foundUser, foundTask, clearCompleteTodosByTaskIdUseCase }
}

async function setupUserNotFound() {
  const mockQuery = jest.fn().mockReturnValue([])
  const connection = MockConnectionAcceptQuery(mockQuery)()
  const findUserByIdService = new PostgresFindUserByIdService(connection)
  const findTaskByIdService = new PostgresFindTaskByIdService(connection)
  const clearCompleteTodosByTaskIdService = new PostgresClearCompleteTodosByTaskIdService(
    connection
  )
  const clearCompleteTodosByTaskIdUseCase = new ClearCompleteTodosByTaskIdUseCaseImplementation(
    findUserByIdService,
    findTaskByIdService,
    clearCompleteTodosByTaskIdService
  )
  const foundUser = await findUserByIdService.execute(userId)
  return { connection, foundUser, clearCompleteTodosByTaskIdUseCase }
}
