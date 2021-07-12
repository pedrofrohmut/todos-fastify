import "jest-extended"

import PostgresDeleteTodoService from "../../../../../src/domain/services/todos/implementations/postgres-delete-todo.service"

import FakeTodoService from "../../../../utils/fakes/todo-service.fake"
import MockConnection from "../../../../utils/mocks/domain/database/database-connection.mock"
import { getError } from "../../../../utils/functions/error.functions"

describe("PostgresDeleteTodoService", () => {
  test("todo should be deleted with no errors", async () => {
    const todoId = FakeTodoService.getValidTodoId()
    const connection = MockConnection()
    const deleteTodoService = new PostgresDeleteTodoService(connection)
    // When
    const serviceErr = await getError(() => deleteTodoService.execute(todoId))
    // Then
    expect(serviceErr).toBeNull()
    expect(connection.mutate).toHaveBeenCalledTimes(1)
    const paramsPassedToDatabase = connection.mutate.mock.calls[0][1]
    expect(paramsPassedToDatabase).toIncludeAllMembers([todoId])
  })
})
