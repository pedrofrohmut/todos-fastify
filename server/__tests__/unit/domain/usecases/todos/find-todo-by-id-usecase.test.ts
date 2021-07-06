import PostgresFindUserByIdService from "../../../../../src/domain/services/users/implementations/postgres-find-user-by-id.service"
import PostgresFindTodoByIdService from "../../../../../src/domain/services/todos/implementations/postgres-find-todo-by-id.service"
import FindTodoByIdUseCaseImplementation from "../../../../../src/domain/usecases/todos/implementations/find-todo-by-id.usecase"

import UserNotFoundByIdError from "../../../../../src/domain/errors/users/user-not-found-by-id.error"
import TodoNotFoundByIdError from "../../../../../src/domain/errors/todos/todo-not-found-by-id.error"

import FakeTodoService from "../../../../utils/fakes/todo-service.fake"
import FakeUserService from "../../../../utils/fakes/user-service.fake"
import { getError } from "../../../../utils/functions/error.functions"
import { expectsToHaveError } from "../../../../utils/functions/expects.functions"
import { MockConnectionAcceptQuery } from "../../../../utils/mocks/domain/database/database-connection.mock"

const userId = FakeUserService.getValidUserId()
const todoId = FakeTodoService.getValidTodoId()
const userDB = FakeUserService.getUserDB("1", userId)
const foundUserFromService = FakeUserService.getUserFromService(userDB)
const todoDB = FakeTodoService.getTodoDB("1", userId, null, todoId)
const foundTodoFromService = FakeTodoService.getTodoFromService(todoDB)

describe("FindTodoByIdService", () => {
  test("User not found thorws UserNotFoundByIdError", async () => {
    const { connection, foundUser, findTodoByIdUseCase } = await setupForUserNotFound()
    // Given
    expect(connection.query).toHaveBeenCalledTimes(1)
    expect(foundUser).toBeNull()
    // When
    const useCaseErr = await getError(() => findTodoByIdUseCase.execute(userId, todoId))
    // Then
    expect(connection.query).toHaveBeenCalledTimes(2)
    expectsToHaveError(useCaseErr, UserNotFoundByIdError)
  })

  test("User found. But todo not found throws TodoNotFoundByIdError", async () => {
    const { connection, foundUser, foundTodo, findTodoByIdUseCase } =
      await setupForUserFoundButTodoNotFound()
    // Given
    expect(connection.query).toHaveBeenCalledTimes(2)
    expect(foundUser).toEqual(foundUserFromService)
    expect(foundTodo).toBeNull()
    // When
    const useCaseErr = await getError(() => findTodoByIdUseCase.execute(userId, todoId))
    // Then
    expect(connection.query).toHaveBeenCalledTimes(4)
    expectsToHaveError(useCaseErr, TodoNotFoundByIdError)
  })

  test("User found and todo found => TodoDto", async () => {
    const { connection, foundUser, foundTodo, findTodoByIdUseCase } =
      await setupForUserAndTodoFound()
    // Given
    expect(connection.query).toHaveBeenCalledTimes(2)
    expect(foundUser).toEqual(foundUserFromService)
    expect(foundTodo).toEqual(foundTodoFromService)
    // When
    const foundTodoFromUseCase = await findTodoByIdUseCase.execute(userId, todoId)
    // Then
    expect(connection.query).toHaveBeenCalledTimes(4)
    expect(foundTodoFromUseCase).toEqual(foundTodoFromService)
  })
})

async function setupForUserAndTodoFound() {
  const mockQuery = jest
    .fn()
    .mockReturnValueOnce([userDB])
    .mockReturnValueOnce([todoDB])
    .mockReturnValueOnce([userDB])
    .mockReturnValueOnce([todoDB])
  const connection = MockConnectionAcceptQuery(mockQuery)()
  const findUserByIdService = new PostgresFindUserByIdService(connection)
  const findTodoByIdService = new PostgresFindTodoByIdService(connection)
  const findTodoByIdUseCase = new FindTodoByIdUseCaseImplementation(
    findUserByIdService,
    findTodoByIdService
  )
  const foundUser = await findUserByIdService.execute(userId)
  const foundTodo = await findTodoByIdService.execute(todoId)
  return { connection, foundUser, foundTodo, findTodoByIdUseCase }
}

async function setupForUserFoundButTodoNotFound() {
  const mockQuery = jest
    .fn()
    .mockReturnValueOnce([userDB])
    .mockReturnValueOnce([])
    .mockReturnValueOnce([userDB])
    .mockReturnValueOnce([])
  const connection = MockConnectionAcceptQuery(mockQuery)()
  const findUserByIdService = new PostgresFindUserByIdService(connection)
  const findTodoByIdService = new PostgresFindTodoByIdService(connection)
  const findTodoByIdUseCase = new FindTodoByIdUseCaseImplementation(
    findUserByIdService,
    findTodoByIdService
  )
  const foundUser = await findUserByIdService.execute(userId)
  const foundTodo = await findTodoByIdService.execute(todoId)
  return { connection, foundUser, foundTodo, findTodoByIdUseCase }
}

async function setupForUserNotFound() {
  const mockQuery = jest.fn().mockReturnValue([])
  const connection = MockConnectionAcceptQuery(mockQuery)()
  const findUserByIdService = new PostgresFindUserByIdService(connection)
  const findTodoByIdService = new PostgresFindTodoByIdService(connection)
  const findTodoByIdUseCase = new FindTodoByIdUseCaseImplementation(
    findUserByIdService,
    findTodoByIdService
  )
  const foundUser = await findUserByIdService.execute(userId)
  return { connection, foundUser, findTodoByIdUseCase }
}
