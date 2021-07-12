import PostgresFindUserByIdService from "../../../../../src/domain/services/users/implementations/postgres-find-user-by-id.service"
import PostgresFindTodoByIdService from "../../../../../src/domain/services/todos/implementations/postgres-find-todo-by-id.service"
import PostgresDeleteTodoService from "../../../../../src/domain/services/todos/implementations/postgres-delete-todo.service"
import DeleteTodoUseCaseImplementation from "../../../../../src/domain/usecases/todos/implementations/delete-todo.usecase"

import UserNotFoundByIdError from "../../../../../src/domain/errors/users/user-not-found-by-id.error"
import TodoNotFoundByIdError from "../../../../../src/domain/errors/todos/todo-not-found-by-id.error"

import FakeTodoService from "../../../../utils/fakes/todo-service.fake"
import FakeUserService from "../../../../utils/fakes/user-service.fake"
import {
  MockConnectionAcceptQuery,
  MockConnectionAcceptQueryAndMutate
} from "../../../../utils/mocks/domain/database/database-connection.mock"
import { expectsToHaveError } from "../../../../utils/functions/expects.functions"
import { getError } from "../../../../utils/functions/error.functions"

const userId = FakeUserService.getValidUserId()
const todoId = FakeTodoService.getValidTodoId()
const userDB = FakeUserService.getUserDB("1", userId)
const foundUserFromService = FakeUserService.getUserFromService(userDB)
const todoDB = FakeTodoService.getTodoDB("1", userId, null, todoId)
const foundTodoFromService = FakeTodoService.getTodoFromService(todoDB)

describe("DeleteTodoUseCaseImplementation", () => {
  test("User not found throws UserNotFoundByIdError", async () => {
    const { connection, foundUser, deleteTodoUseCase } = await setupUserNotFound()
    // Given
    expect(connection.query).toHaveBeenCalledTimes(1)
    expect(foundUser).toBeNull()
    // When
    const useCaseErr = await getError(() => deleteTodoUseCase.execute(userId, todoId))
    // Then
    expect(connection.query).toHaveBeenCalledTimes(2)
    expect(connection.mutate).not.toHaveBeenCalled()
    expectsToHaveError(useCaseErr, UserNotFoundByIdError)
    expect(useCaseErr.message).toContain(UserNotFoundByIdError.message)
  })

  test("User found. But todo not found throws TodoNotFoundByIdError", async () => {
    const { connection, foundUser, foundTodo, deleteTodoUseCase } =
      await setupUserFoundButTodoNotFound()
    // Given
    expect(connection.query).toHaveBeenCalledTimes(2)
    expect(foundUser).toEqual(foundUserFromService)
    expect(foundTodo).toBeNull()
    // When
    const useCaseErr = await getError(() => deleteTodoUseCase.execute(userId, todoId))
    // Then
    expect(connection.query).toHaveBeenCalledTimes(4)
    expect(connection.mutate).not.toHaveBeenCalled()
    expectsToHaveError(useCaseErr, TodoNotFoundByIdError)
    expect(useCaseErr.message).toContain(TodoNotFoundByIdError.message)
  })

  test("User and todo found. But error to deleteTodo throws errors", async () => {
    const { connection, foundUser, foundTodo, deleteErr, deleteTodoUseCase } =
      await UserAndTodoFoundButErrorToDelete()
    // Given
    expect(connection.query).toHaveBeenCalledTimes(2)
    expect(connection.mutate).toHaveBeenCalledTimes(1)
    expect(foundUser).toEqual(foundUserFromService)
    expect(foundTodo).toEqual(foundTodoFromService)
    expectsToHaveError(deleteErr)
    // When
    const useCaseErr = await getError(() => deleteTodoUseCase.execute(userId, todoId))
    // Then
    expect(connection.query).toHaveBeenCalledTimes(4)
    expect(connection.mutate).toHaveBeenCalledTimes(2)
    expectsToHaveError(useCaseErr)
  })

  test("User and todo found and no errors to deleteTodo throw no errors", async () => {
    const { connection, foundUser, foundTodo, deleteErr, deleteTodoUseCase } =
      await setupUserAndTodoFoundAndNoErrorToDelete()
    // Given
    expect(connection.query).toHaveBeenCalledTimes(2)
    expect(connection.mutate).toHaveBeenCalledTimes(1)
    expect(foundUser).toEqual(foundUserFromService)
    expect(foundTodo).toEqual(foundTodoFromService)
    expect(deleteErr).toBeFalsy()
    // When
    const useCaseErr = await getError(() => deleteTodoUseCase.execute(userId, todoId))
    // Then
    expect(connection.query).toHaveBeenCalledTimes(4)
    expect(connection.mutate).toHaveBeenCalledTimes(2)
    expect(useCaseErr).toBeFalsy()
  })
})

async function setupUserAndTodoFoundAndNoErrorToDelete() {
  const mockQuery = jest
    .fn()
    .mockReturnValueOnce([userDB])
    .mockReturnValueOnce([todoDB])
    .mockReturnValueOnce([userDB])
    .mockReturnValueOnce([todoDB])
  const connection = MockConnectionAcceptQuery(mockQuery)()
  const findUserByIdService = new PostgresFindUserByIdService(connection)
  const findTodoByIdService = new PostgresFindTodoByIdService(connection)
  const deleteTodoService = new PostgresDeleteTodoService(connection)
  const deleteTodoUseCase = new DeleteTodoUseCaseImplementation(
    findUserByIdService,
    findTodoByIdService,
    deleteTodoService
  )
  const foundUser = await findUserByIdService.execute(userId)
  const foundTodo = await findTodoByIdService.execute(todoId)
  const deleteErr = await getError(() => deleteTodoService.execute(todoId))
  return { connection, foundUser, foundTodo, deleteErr, deleteTodoUseCase }
}

async function UserAndTodoFoundButErrorToDelete() {
  const mockQuery = jest
    .fn()
    .mockReturnValueOnce([userDB])
    .mockReturnValueOnce([todoDB])
    .mockReturnValueOnce([userDB])
    .mockReturnValueOnce([todoDB])
  const mockMutate = jest.fn(() => {
    throw new Error("Mock Error Mutate")
  })
  const connection = MockConnectionAcceptQueryAndMutate(mockQuery, mockMutate)()
  const findUserByIdService = new PostgresFindUserByIdService(connection)
  const findTodoByIdService = new PostgresFindTodoByIdService(connection)
  const deleteTodoService = new PostgresDeleteTodoService(connection)
  const deleteTodoUseCase = new DeleteTodoUseCaseImplementation(
    findUserByIdService,
    findTodoByIdService,
    deleteTodoService
  )
  const foundUser = await findUserByIdService.execute(userId)
  const foundTodo = await findTodoByIdService.execute(todoId)
  const deleteErr = await getError(() => deleteTodoService.execute(todoId))
  return { connection, foundUser, foundTodo, deleteErr, deleteTodoUseCase }
}

async function setupUserFoundButTodoNotFound() {
  const mockQuery = jest
    .fn()
    .mockReturnValueOnce([userDB])
    .mockReturnValueOnce([])
    .mockReturnValueOnce([userDB])
    .mockReturnValueOnce([])
  const connection = MockConnectionAcceptQuery(mockQuery)()
  const findUserByIdService = new PostgresFindUserByIdService(connection)
  const findTodoByIdService = new PostgresFindTodoByIdService(connection)
  const deleteTodoService = new PostgresDeleteTodoService(connection)
  const deleteTodoUseCase = new DeleteTodoUseCaseImplementation(
    findUserByIdService,
    findTodoByIdService,
    deleteTodoService
  )
  const foundUser = await findUserByIdService.execute(userId)
  const foundTodo = await findTodoByIdService.execute(todoId)
  return { connection, foundUser, foundTodo, deleteTodoUseCase }
}

async function setupUserNotFound() {
  const mockQuery = jest.fn().mockReturnValue([])
  const connection = MockConnectionAcceptQuery(mockQuery)()
  const findUserByIdService = new PostgresFindUserByIdService(connection)
  const findTodoByIdService = new PostgresFindTodoByIdService(connection)
  const deleteTodoService = new PostgresDeleteTodoService(connection)
  const deleteTodoUseCase = new DeleteTodoUseCaseImplementation(
    findUserByIdService,
    findTodoByIdService,
    deleteTodoService
  )
  const foundUser = await findUserByIdService.execute(userId)
  return { connection, foundUser, deleteTodoUseCase }
}
