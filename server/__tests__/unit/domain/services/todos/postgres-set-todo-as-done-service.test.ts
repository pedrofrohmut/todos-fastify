import "jest-extended"

import PostgresSetTodoAsDoneService from "../../../../../src/domain/services/todos/implementations/postgres-set-todo-as-done.service"

import FakeTodoService from "../../../../utils/fakes/todo-service.fake"
import MockConnection from "../../../../utils/mocks/domain/database/database-connection.mock"
import { getError } from "../../../../utils/functions/error.functions"

const todoId = FakeTodoService.getValidTodoId()

describe("PostgresSetTodoAsDoneService", () => {
  test("Todo should be set with no errors", async () => {
    const connection = MockConnection()
    const setTodoAsDoneService = new PostgresSetTodoAsDoneService(connection)
    // When
    const serviceErr = await getError(() => setTodoAsDoneService.execute(todoId))
    // Then
    expect(serviceErr).toBeFalsy()
    expect(connection.mutate).toHaveBeenCalledTimes(1)
    const paramsPassedToDatabase = connection.mutate.mock.calls[0][1]
    expect(paramsPassedToDatabase).toIncludeAllMembers([todoId])
  })
})
