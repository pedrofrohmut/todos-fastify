import PostgresFindUserByIdService from "../../../../../src/domain/services/users/implementations/postgres-find-user-by-id.service"
import PostgresFindTaskByIdService from "../../../../../src/domain/services/tasks/implementations/postgres-find-task-by-id.service"
import PostgresFindTodosByTaskIdService from "../../../../../src/domain/services/todos/implementations/postgres-find-todos-by-task-id.service"
import FindTodosByTaskIdUseCaseImplementation from "../../../../../src/domain/usecases/todos/implementations/find-todos-by-task-id.usecase"

import UserNotFoundByIdError from "../../../../../src/domain/errors/users/user-not-found-by-id.error"
import TaskNotFoundByIdError from "../../../../../src/domain/errors/tasks/task-not-found-by-id.error"

import FakeTaskService from "../../../../utils/fakes/task-service.fake"
import FakeUserService from "../../../../utils/fakes/user-service.fake"
import { MockConnectionAcceptQuery } from "../../../../utils/mocks/domain/database/database-connection.mock"
import { expectsToHaveError } from "../../../../utils/functions/expects.functions"
import { getError } from "../../../../utils/functions/error.functions"
import FakeTodoService from "../../../../utils/fakes/todo-service.fake"

const userId = FakeUserService.getValidUserId()
const taskId = FakeTaskService.getValidTaskId()
const userDB = FakeUserService.getUserDB("1", userId)
const foundUserFromService = FakeUserService.getUserFromService(userDB)
const taskDB = FakeTaskService.getTaskDB("1", userId, taskId)
const foundTaskFromService = FakeTaskService.getTaskFromService(taskDB)
const todoDB1 = FakeTodoService.getTodoDB("1", userId, taskId, null)
const todoDB2 = FakeTodoService.getTodoDB("2", userId, taskId, null)
const todoDB3 = FakeTodoService.getTodoDB("3", userId, taskId, null)
const foundTodoFromService1 = FakeTodoService.getTodoFromService(todoDB1)
const foundTodoFromService2 = FakeTodoService.getTodoFromService(todoDB2)
const foundTodoFromService3 = FakeTodoService.getTodoFromService(todoDB3)

describe("FindTodosByTaskIdUseCaseImplementation", () => {
  test("User not found throws UserNotFoundByIdError", async () => {
    const { connection, foundUser, findTodosByTaskIdUseCase } = await setupUserNotFound()
    // Given
    expect(connection.query).toHaveBeenCalledTimes(1)
    expect(foundUser).toBeNull()
    // When
    const useCaseErr = await getError(() => findTodosByTaskIdUseCase.execute(userId, taskId))
    // Then
    expect(connection.query).toHaveBeenCalledTimes(2)
    expectsToHaveError(useCaseErr, UserNotFoundByIdError)
    expect(useCaseErr.message).toContain(UserNotFoundByIdError.message)
  })

  test("User found. But task not found throws TaskNotFoundByIdError", async () => {
    const { connection, foundUser, foundTask, findTodosByTaskIdUseCase } =
      await setupUserFoundButTaskNotFound()
    // Given
    expect(connection.query).toHaveBeenCalledTimes(2)
    expect(foundUser).toEqual(foundUserFromService)
    expect(foundTask).toBeNull()
    // When
    const useCaseErr = await getError(() => findTodosByTaskIdUseCase.execute(userId, taskId))
    // Then
    expect(connection.query).toHaveBeenCalledTimes(4)
    expectsToHaveError(useCaseErr, TaskNotFoundByIdError)
    expect(useCaseErr.message).toContain(TaskNotFoundByIdError.message)
  })

  test("User and task found. But no todos found => empty array", async () => {
    const { connection, foundUser, foundTask, findTodosByTaskIdUseCase } =
      await setupUserAndTaskFoundButTodosNotFound()
    // Given
    expect(connection.query).toHaveBeenCalledTimes(2)
    expect(foundUser).toEqual(foundUserFromService)
    expect(foundTask).toEqual(foundTaskFromService)
    // When
    const foundTodoFromUseCase = await findTodosByTaskIdUseCase.execute(userId, taskId)
    // Then
    expect(connection.query).toHaveBeenCalledTimes(5)
    expect(foundTodoFromUseCase).toBeArrayOfSize(0)
  })

  test("User, task and todos found => filled array with found todos", async () => {
    const { connection, foundUser, foundTask, foundTodos, findTodosByTaskIdUseCase } =
      await setupUserTaskAndTodosFound()
    // Given
    expect(connection.query).toHaveBeenCalledTimes(3)
    expect(foundUser).toEqual(foundUserFromService)
    expect(foundTask).toEqual(foundTaskFromService)
    expect(foundTodos).toIncludeAllMembers([
      foundTodoFromService1,
      foundTodoFromService2,
      foundTodoFromService3
    ])
    // When
    const foundTodosFromUseCase = await findTodosByTaskIdUseCase.execute(userId, taskId)
    // Then
    expect(connection.query).toHaveBeenCalledTimes(6)
    expect(foundTodosFromUseCase).toBeArrayOfSize(3)
    expect(foundTodosFromUseCase).toIncludeAllMembers([
      foundTodoFromService1,
      foundTodoFromService2,
      foundTodoFromService3
    ])
  })
})

async function setupUserTaskAndTodosFound() {
  const mockQuery = jest
    .fn()
    .mockReturnValueOnce([userDB])
    .mockReturnValueOnce([taskDB])
    .mockReturnValueOnce([todoDB1, todoDB2, todoDB3])
    .mockReturnValueOnce([userDB])
    .mockReturnValueOnce([taskDB])
    .mockReturnValueOnce([todoDB1, todoDB2, todoDB3])
  const connection = MockConnectionAcceptQuery(mockQuery)()
  const findUserByIdService = new PostgresFindUserByIdService(connection)
  const findTaskByIdService = new PostgresFindTaskByIdService(connection)
  const findTodosByTaskIdService = new PostgresFindTodosByTaskIdService(connection)
  const findTodosByTaskIdUseCase = new FindTodosByTaskIdUseCaseImplementation(
    findUserByIdService,
    findTaskByIdService,
    findTodosByTaskIdService
  )
  const foundUser = await findUserByIdService.execute(userId)
  const foundTask = await findTaskByIdService.execute(taskId)
  const foundTodos = await findTodosByTaskIdService.execute(taskId)
  return { connection, foundUser, foundTask, foundTodos, findTodosByTaskIdUseCase }
}

async function setupUserAndTaskFoundButTodosNotFound() {
  const mockQuery = jest
    .fn()
    .mockReturnValueOnce([userDB])
    .mockReturnValueOnce([taskDB])
    .mockReturnValueOnce([userDB])
    .mockReturnValueOnce([taskDB])
    .mockReturnValueOnce([])
  const connection = MockConnectionAcceptQuery(mockQuery)()
  const findUserByIdService = new PostgresFindUserByIdService(connection)
  const findTaskByIdService = new PostgresFindTaskByIdService(connection)
  const findTodosByTaskIdService = new PostgresFindTodosByTaskIdService(connection)
  const findTodosByTaskIdUseCase = new FindTodosByTaskIdUseCaseImplementation(
    findUserByIdService,
    findTaskByIdService,
    findTodosByTaskIdService
  )
  const foundUser = await findUserByIdService.execute(userId)
  const foundTask = await findTaskByIdService.execute(taskId)
  return { connection, foundUser, foundTask, findTodosByTaskIdUseCase }
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
  const findTodosByTaskIdService = new PostgresFindTodosByTaskIdService(connection)
  const findTodosByTaskIdUseCase = new FindTodosByTaskIdUseCaseImplementation(
    findUserByIdService,
    findTaskByIdService,
    findTodosByTaskIdService
  )
  const foundUser = await findUserByIdService.execute(userId)
  const foundTask = await findTaskByIdService.execute(taskId)
  return { connection, foundUser, foundTask, findTodosByTaskIdUseCase }
}

async function setupUserNotFound() {
  const mockQuery = jest.fn().mockReturnValue([])
  const connection = MockConnectionAcceptQuery(mockQuery)()
  const findUserByIdService = new PostgresFindUserByIdService(connection)
  const findTaskByIdService = new PostgresFindTaskByIdService(connection)
  const findTodosByTaskIdService = new PostgresFindTodosByTaskIdService(connection)
  const findTodosByTaskIdUseCase = new FindTodosByTaskIdUseCaseImplementation(
    findUserByIdService,
    findTaskByIdService,
    findTodosByTaskIdService
  )
  const foundUser = await findUserByIdService.execute(userId)
  return { connection, foundUser, findTodosByTaskIdUseCase }
}
