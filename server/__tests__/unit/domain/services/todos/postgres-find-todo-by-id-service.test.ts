import PostgresFindTodoByIdService from "../../../../../src/domain/services/todos/implementations/postgres-find-todo-by-id.service"

import FakeTaskService from "../../../../utils/fakes/task-service.fake"
import FakeTodoService from "../../../../utils/fakes/todo-service.fake"
import FakeUserService from "../../../../utils/fakes/user-service.fake"
import { MockConnectionAcceptQuery } from "../../../../utils/mocks/domain/database/database-connection.mock"

const userId = FakeUserService.getValidUserId()
const taskId = FakeTaskService.getValidTaskId()
const todoId = FakeTodoService.getValidTodoId()
const todoDB = FakeTodoService.getTodoDB("1", userId, taskId, todoId)
const todoFromService = FakeTodoService.getTodoFromService(todoDB)

describe("PostgresFindTodoByIdService", () => {
  test("Todo not found => null", async () => {
    const mockQuery = jest.fn().mockReturnValue([])
    const connection = MockConnectionAcceptQuery(mockQuery)()
    const findTodoByIdService = new PostgresFindTodoByIdService(connection)
    // When
    const foundTodo = await findTodoByIdService.execute(todoId)
    // Then
    expect(connection.query).toHaveBeenCalledTimes(1)
    expect(foundTodo).toBeNull()
  })

  test("Todo found => TodoDto", async () => {
    const mockQuery = jest.fn().mockReturnValue([todoDB])
    const connection = MockConnectionAcceptQuery(mockQuery)()
    const findTodoByIdService = new PostgresFindTodoByIdService(connection)
    // When
    const foundTodo = await findTodoByIdService.execute(todoId)
    // Then
    expect(connection.query).toHaveBeenCalledTimes(1)
    expect(foundTodo).toEqual(todoFromService)
  })
})
