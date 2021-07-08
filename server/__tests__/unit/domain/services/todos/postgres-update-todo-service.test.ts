import PostgresUpdateTodoService from "../../../../../src/domain/services/todos/implementations/postgres-update-todo.service"

import FakeTodoService from "../../../../utils/fakes/todo-service.fake"
import { getError } from "../../../../utils/functions/error.functions"

import {MockConnectionAcceptMutate} from "../../../../utils/mocks/domain/database/database-connection.mock"

const todoId = FakeTodoService.getValidTodoId()
const mockMutate = jest.fn()
const connection = MockConnectionAcceptMutate(mockMutate)()
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
    const todoDescriptionPassedToMutate = mockMutate.mock.calls[0][1][1]
    expect(todoDescriptionPassedToMutate).toBe("")
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
    expect(serviceErr).toBeFalsy()
  })
})
