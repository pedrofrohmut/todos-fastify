import "jest-extended"

import PostgresFindTodosByTaskIdService from "../../../../../src/domain/services/todos/implementations/postgres-find-todos-by-task-id.service"

import FakeTaskService from "../../../../utils/fakes/task-service.fake"
import FakeTodoService from "../../../../utils/fakes/todo-service.fake"
import { MockConnectionAcceptQuery } from "../../../../utils/mocks/domain/database/database-connection.mock"

const taskId = FakeTaskService.getValidTaskId()

describe("PostgresFindTodosByTaskIdService", () => {
  test("No todos found => empty array", async () => {
    const { findTodosByTaskIdService, connection } = setupTodosNotFound()
    // When
    const foundTodos = await findTodosByTaskIdService.execute(taskId)
    // Then
    expect(connection.query).toHaveBeenCalledTimes(1)
    expect(foundTodos).toBeArrayOfSize(0)
  })

  test("Todos found => filled array with found todos", async () => {
    const {
      findTodosByTaskIdService,
      connection,
      foundTodoFromService1,
      foundTodoFromService2,
      foundTodoFromService3
    } = setupTodosFound()
    // When
    const foundTodos = await findTodosByTaskIdService.execute(taskId)
    // Then
    expect(connection.query).toHaveBeenCalledTimes(1)
    expect(foundTodos).toBeArrayOfSize(3)
    expect(foundTodos).toIncludeAllMembers([
      foundTodoFromService1,
      foundTodoFromService2,
      foundTodoFromService3
    ])
  })
})

function setupTodosNotFound() {
  const mockQuery = jest.fn().mockReturnValue([])
  const connection = MockConnectionAcceptQuery(mockQuery)()
  const findTodosByTaskIdService = new PostgresFindTodosByTaskIdService(connection)
  return { findTodosByTaskIdService, connection }
}

function setupTodosFound() {
  const todoDB1 = FakeTodoService.getTodoDB("1", null, taskId, null)
  const todoDB2 = FakeTodoService.getTodoDB("2", null, taskId, null)
  const todoDB3 = FakeTodoService.getTodoDB("3", null, taskId, null)
  const foundTodoFromService1 = FakeTodoService.getTodoFromService(todoDB1)
  const foundTodoFromService2 = FakeTodoService.getTodoFromService(todoDB2)
  const foundTodoFromService3 = FakeTodoService.getTodoFromService(todoDB3)
  const mockQuery = jest.fn().mockReturnValue([todoDB1, todoDB2, todoDB3])
  const connection = MockConnectionAcceptQuery(mockQuery)()
  const findTodosByTaskIdService = new PostgresFindTodosByTaskIdService(connection)
  return {
    findTodosByTaskIdService,
    connection,
    foundTodoFromService1,
    foundTodoFromService2,
    foundTodoFromService3
  }
}
