import { CreateTodoDto } from "../../../../../src/domain/types/todo.types"

import PostgresFindUserByIdService from "../../../../../src/domain/services/users/implementations/postgres-find-user-by-id.service"
import PostgresFindTaskByIdService from "../../../../../src/domain/services/tasks/implementations/postgres-find-task-by-id.service"
import PostgresCreateTodoService from "../../../../../src/domain/services/todos/implementations/postgres-create-todo.service"
import CreateTodoUseCaseImplementation from "../../../../../src/domain/usecases/todos/implementations/create-todo.usecase"

import UserNotFoundByIdError from "../../../../../src/domain/errors/users/user-not-found-by-id.error"
import TaskNotFoundByIdError from "../../../../../src/domain/errors/tasks/task-not-found-by-id.error"

import FakeTaskService from "../../../../utils/fakes/task-service.fake"
import FakeUserService from "../../../../utils/fakes/user-service.fake"
import {
  MockConnectionAcceptQuery,
  MockConnectionAcceptQueryAndMutate
} from "../../../../utils/mocks/domain/database/database-connection.mock"
import { expectsToHaveError } from "../../../../utils/functions/expects.functions"
import { getError } from "../../../../utils/functions/error.functions"

const userId = FakeUserService.getValidUserId()
const taskId = FakeTaskService.getValidTaskId()
const newTodo: CreateTodoDto = {
  name: "Todo Name",
  description: "Todo Description",
  isDone: false,
  taskId,
  userId
}
const userDB = FakeUserService.getUserDB("1", userId)
const foundUserFromService = FakeUserService.getUserFromService(userDB)
const taskDB = FakeTaskService.getTaskDB("1", userId, taskId)
const foundTaskFromService = FakeTaskService.getTaskFromService(taskDB)

describe("CreateTodoUseCaseImplementation", () => {
  test("User not found by id throws UserNotFoundByIdError", async () => {
    const mockQuery = jest.fn().mockReturnValue([])
    const connection = MockConnectionAcceptQuery(mockQuery)()
    const findUserByIdService = new PostgresFindUserByIdService(connection)
    const findTaskByIdService = new PostgresFindTaskByIdService(connection)
    const createTodoService = new PostgresCreateTodoService(connection)
    const createTodoUseCase = new CreateTodoUseCaseImplementation(
      findUserByIdService,
      findTaskByIdService,
      createTodoService
    )
    const foundUser = await findUserByIdService.execute(userId)
    // Given
    expect(connection.query).toHaveBeenCalledTimes(1)
    expect(foundUser).toBeNull()
    // When
    const useCaseErr = await getError(() => createTodoUseCase.execute(newTodo))
    // Then
    expect(connection.query).toHaveBeenCalledTimes(2)
    expectsToHaveError(useCaseErr, UserNotFoundByIdError)
  })

  test("User found. But task not found by id throws TaskNotFoundByIdError", async () => {
    const mockQuery = jest
      .fn()
      .mockReturnValueOnce([userDB])
      .mockReturnValueOnce([])
      .mockReturnValueOnce([userDB])
      .mockReturnValueOnce([])
    const connection = MockConnectionAcceptQuery(mockQuery)()
    const findUserByIdService = new PostgresFindUserByIdService(connection)
    const findTaskByIdService = new PostgresFindTaskByIdService(connection)
    const createTodoService = new PostgresCreateTodoService(connection)
    const createTodoUseCase = new CreateTodoUseCaseImplementation(
      findUserByIdService,
      findTaskByIdService,
      createTodoService
    )
    const foundUser = await findUserByIdService.execute(userId)
    const foundTask = await findTaskByIdService.execute(taskId)
    // Given
    expect(connection.query).toHaveBeenCalledTimes(2)
    expect(foundUser).toEqual(foundUserFromService)
    expect(foundTask).toBeNull()
    // When
    const useCaseErr = await getError(() => createTodoUseCase.execute(newTodo))
    // Then
    expect(connection.query).toHaveBeenCalledTimes(4)
    expectsToHaveError(useCaseErr, TaskNotFoundByIdError)
  })

  test("User found and task found but error to create a task throws error", async () => {
    const mockQuery = jest
      .fn()
      .mockReturnValueOnce([userDB])
      .mockReturnValueOnce([taskDB])
      .mockReturnValueOnce([userDB])
      .mockReturnValueOnce([taskDB])
    const mockMutate = jest.fn(() => {
      throw new Error("Mock Mutate Error")
    })
    const connection = MockConnectionAcceptQueryAndMutate(mockQuery, mockMutate)()
    const findUserByIdService = new PostgresFindUserByIdService(connection)
    const findTaskByIdService = new PostgresFindTaskByIdService(connection)
    const createTodoService = new PostgresCreateTodoService(connection)
    const createTodoUseCase = new CreateTodoUseCaseImplementation(
      findUserByIdService,
      findTaskByIdService,
      createTodoService
    )
    const foundUser = await findUserByIdService.execute(userId)
    const foundTask = await findTaskByIdService.execute(taskId)
    const serviceErr = await getError(() => createTodoService.execute(newTodo))
    // Given
    expect(connection.query).toHaveBeenCalledTimes(2)
    expect(connection.mutate).toHaveBeenCalledTimes(1)
    expect(foundUser).toEqual(foundUserFromService)
    expect(foundTask).toEqual(foundTaskFromService)
    expectsToHaveError(serviceErr)
    // When
    const useCaseErr = await getError(() => createTodoUseCase.execute(newTodo))
    // Then
    expect(connection.query).toHaveBeenCalledTimes(4)
    expect(connection.mutate).toHaveBeenCalledTimes(2)
    expectsToHaveError(useCaseErr)
    expect(useCaseErr).not.toBeInstanceOf(UserNotFoundByIdError)
    expect(useCaseErr).not.toBeInstanceOf(TaskNotFoundByIdError)
  })

  test("User found, task found and no errors to create throws no errors", async () => {
    const mockQuery = jest
      .fn()
      .mockReturnValueOnce([userDB])
      .mockReturnValueOnce([taskDB])
      .mockReturnValueOnce([userDB])
      .mockReturnValueOnce([taskDB])
    const connection = MockConnectionAcceptQuery(mockQuery)()
    const findUserByIdService = new PostgresFindUserByIdService(connection)
    const findTaskByIdService = new PostgresFindTaskByIdService(connection)
    const createTodoService = new PostgresCreateTodoService(connection)
    const createTodoUseCase = new CreateTodoUseCaseImplementation(
      findUserByIdService,
      findTaskByIdService,
      createTodoService
    )
    const foundUser = await findUserByIdService.execute(userId)
    const foundTask = await findTaskByIdService.execute(taskId)
    const serviceErr = await getError(() => createTodoService.execute(newTodo))
    // Given
    expect(connection.query).toHaveBeenCalledTimes(2)
    expect(connection.mutate).toHaveBeenCalledTimes(1)
    expect(foundUser).toEqual(foundUserFromService)
    expect(foundTask).toEqual(foundTaskFromService)
    expect(serviceErr).toBeFalsy()
    // When
    const useCaseErr = await getError(() => createTodoUseCase.execute(newTodo))
    // Then
    expect(connection.query).toHaveBeenCalledTimes(4)
    expect(connection.mutate).toHaveBeenCalledTimes(2)
    expect(useCaseErr).toBeFalsy()
  })
})
