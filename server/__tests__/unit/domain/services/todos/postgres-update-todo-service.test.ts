import "jest-extended"

import PostgresUpdateTodoService from "../../../../../src/domain/services/todos/implementations/postgres-update-todo.service"

import FakeTodoService from "../../../../utils/fakes/todo-service.fake"
import { getError } from "../../../../utils/functions/error.functions"
import MockConnection from "../../../../utils/mocks/domain/database/database-connection.mock"

const todoId = FakeTodoService.getValidTodoId()
const connection = MockConnection()
const updateTodoService = new PostgresUpdateTodoService(connection)

describe("PostgresUpdateTodoService", () => {
  test("Todo with no description should be updated with no errors", async () => {
    const updatedTodo = {
      id: todoId,
      name: "Todo Name Updated",
      isDone: false
    }
    // When
    const serviceErr = await getError(() => updateTodoService.execute(updatedTodo))
    // Then
    expect(connection.mutate).toHaveBeenCalledTimes(1)
    const paramsPassedToDatabase = connection.mutate.mock.calls[0][1]
    expect(paramsPassedToDatabase).toIncludeAllMembers([
      updatedTodo.name,
      "",
      updatedTodo.isDone,
      updatedTodo.id
    ])
    expect(serviceErr).toBeFalsy()
  })

  test("Todo with description should be updated with no errors", async () => {
    const updatedTodo = {
      id: todoId,
      name: "Todo Name Updated",
      description: "Todo Description Updated",
      isDone: false
    }
    // When
    const serviceErr = await getError(() => updateTodoService.execute(updatedTodo))
    // Then
    expect(connection.mutate).toHaveBeenCalledTimes(1)
    const paramsPassedToDatabase = connection.mutate.mock.calls[0][1]
    expect(paramsPassedToDatabase).toIncludeAllMembers([
      updatedTodo.name,
      updatedTodo.description,
      updatedTodo.isDone,
      updatedTodo.id
    ])
    expect(serviceErr).toBeFalsy()
  })
})
