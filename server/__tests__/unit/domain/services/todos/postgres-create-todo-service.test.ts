import { CreateTodoDto } from "../../../../../src/domain/types/todo.types"

import PostgresCreateTodoService from "../../../../../src/domain/services/todos/implementations/postgres-create-todo.service"

import FakeUserService from "../../../../utils/fakes/user-service.fake"
import FakeTaskService from "../../../../utils/fakes/task-service.fake"
import { getError } from "../../../../utils/functions/error.functions"
import MockConnection from "../../../../utils/mocks/domain/database/database-connection.mock"

describe("PostgresCreateTodoService", () => {
  test("Valid todo should be added with no errors", async () => {
    const userId = FakeUserService.getValidUserId()
    const taskId = FakeTaskService.getValidTaskId()
    const newTodo: CreateTodoDto = {
      name: "Todo Name",
      description: "Todo Description",
      taskId,
      userId
    }
    const connection = MockConnection()
    const createTodoService = new PostgresCreateTodoService(connection)
    // When
    const serviceErr = await getError(() => createTodoService.execute(newTodo))
    // Then
    expect(connection.mutate).toHaveBeenCalledTimes(1)
    expect(serviceErr).toBeFalsy()
  })
})
