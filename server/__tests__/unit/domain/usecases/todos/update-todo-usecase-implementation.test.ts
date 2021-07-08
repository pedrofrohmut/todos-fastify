import "jest-extended"

import { UpdateTodoBody } from "../../../../../src/domain/types/request/body.types"

import PostgresFindUserByIdService from "../../../../../src/domain/services/users/implementations/postgres-find-user-by-id.service"
import PostgresFindTodoByIdService from "../../../../../src/domain/services/todos/implementations/postgres-find-todo-by-id.service"
import PostgresUpdateTodoService from "../../../../../src/domain/services/todos/implementations/postgres-update-todo.service"
import UpdateTodoUseCaseImplementation from "../../../../../src/domain/usecases/todos/implementations/update-todo.usecase"

import UserNotFoundByIdError from "../../../../../src/domain/errors/users/user-not-found-by-id.error"
import TodoNotFoundByIdError from "../../../../../src/domain/errors/todos/todo-not-found-by-id.error"

import FakeUserService from "../../../../utils/fakes/user-service.fake"
import FakeTodoService from "../../../../utils/fakes/todo-service.fake"
import { getError } from "../../../../utils/functions/error.functions"
import { expectsToHaveError } from "../../../../utils/functions/expects.functions"
import { MockConnectionAcceptQuery } from "../../../../utils/mocks/domain/database/database-connection.mock"

const updatedTodo: UpdateTodoBody = {
  name: "Todo Name Updated",
  description: "Todo Description Updated",
  isDone: false
}
const userId = FakeUserService.getValidUserId()
const todoId = FakeTodoService.getValidTodoId()
const userDB = FakeUserService.getUserDB("1", userId)
const foundUserFromService = FakeUserService.getUserFromService(userDB)
const todoDB = FakeTodoService.getTodoDB("1", userId, null, todoId)
const foundTodoFromService = FakeTodoService.getTodoFromService(todoDB)

describe("UpdateTodoUseCaseImplementation", () => {
  test("User not found by id throws UserNotFoundByIdError", async () => {
    const { connection, foundUser, updateTodoUseCase } = await setupUserNotFound()
    // Given
    expect(connection.query).toHaveBeenCalledTimes(1)
    expect(foundUser).toBeNull()
    // When
    const useCaseErr = await getError(() => updateTodoUseCase.execute(userId, todoId, updatedTodo))
    // Then
    expect(connection.query).toHaveBeenCalledTimes(2)
    expect(connection.mutate).not.toHaveBeenCalled()
    expectsToHaveError(useCaseErr, UserNotFoundByIdError)
    expect(useCaseErr.message).toContain(UserNotFoundByIdError.message)
  })

  test("User found. But Todo not found by id throws TodoNotFoundByIdError", async () => {
    const { connection, foundUser, foundTodo, updateTodoUseCase } =
      await setupUserFoundButTodoNotFound()
    // Given
    expect(connection.query).toHaveBeenCalledTimes(2)
    expect(foundUser).toEqual(foundUserFromService)
    expect(foundTodo).toBeNull()
    // When
    const useCaseErr = await getError(() => updateTodoUseCase.execute(userId, todoId, updatedTodo))
    // Then
    expect(connection.query).toHaveBeenCalledTimes(4)
    expect(connection.mutate).not.toHaveBeenCalled()
    expectsToHaveError(useCaseErr, TodoNotFoundByIdError)
    expect(useCaseErr.message).toContain(TodoNotFoundByIdError.message)
  })

  test("User and todo found. Executes with no errors", async () => {
    const { connection, foundUser, foundTodo, updateTodoUseCase } = await setupUserAndTodoFound()
    // Given
    expect(connection.query).toHaveBeenCalledTimes(2)
    expect(foundUser).toEqual(foundUserFromService)
    expect(foundTodo).toEqual(foundTodoFromService)
    // When
    const useCaseErr = await getError(() => updateTodoUseCase.execute(userId, todoId, updatedTodo))
    // Then
    expect(connection.query).toHaveBeenCalledTimes(4)
    expect(connection.mutate).toHaveBeenCalledTimes(1)
    expect(useCaseErr).toBeFalsy()
  })
})

async function setupUserAndTodoFound() {
  const mockQuery = jest
    .fn()
    .mockReturnValueOnce([userDB])
    .mockReturnValueOnce([todoDB])
    .mockReturnValueOnce([userDB])
    .mockReturnValueOnce([todoDB])
  const connection = MockConnectionAcceptQuery(mockQuery)()
  const findUserByIdService = new PostgresFindUserByIdService(connection)
  const findTodoByIdService = new PostgresFindTodoByIdService(connection)
  const updateTodoService = new PostgresUpdateTodoService(connection)
  const updateTodoUseCase = new UpdateTodoUseCaseImplementation(
    findUserByIdService,
    findTodoByIdService,
    updateTodoService
  )
  const foundUser = await findUserByIdService.execute(userId)
  const foundTodo = await findTodoByIdService.execute(todoId)
  return { connection, foundUser, foundTodo, updateTodoUseCase }
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
  const updateTodoService = new PostgresUpdateTodoService(connection)
  const updateTodoUseCase = new UpdateTodoUseCaseImplementation(
    findUserByIdService,
    findTodoByIdService,
    updateTodoService
  )
  const foundUser = await findUserByIdService.execute(userId)
  const foundTodo = await findTodoByIdService.execute(todoId)
  return { connection, foundUser, foundTodo, updateTodoUseCase }
}

async function setupUserNotFound() {
  const mockQuery = jest.fn().mockReturnValue([])
  const connection = MockConnectionAcceptQuery(mockQuery)()
  const findUserByIdService = new PostgresFindUserByIdService(connection)
  const findTodoByIdService = new PostgresFindTodoByIdService(connection)
  const updateTodoService = new PostgresUpdateTodoService(connection)
  const updateTodoUseCase = new UpdateTodoUseCaseImplementation(
    findUserByIdService,
    findTodoByIdService,
    updateTodoService
  )
  const foundUser = await findUserByIdService.execute(userId)
  return { connection, foundUser, updateTodoUseCase }
}
