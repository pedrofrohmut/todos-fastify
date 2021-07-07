import "jest-extended"

import PostgresFindTasksByUserIdService from "../../../../../src/domain/services/tasks/implementations/postgres-find-tasks-by-user-id.service"

import FakeTaskService from "../../../../utils/fakes/task-service.fake"
import FakeUserService from "../../../../utils/fakes/user-service.fake"
import { MockConnectionAcceptQuery } from "../../../../utils/mocks/domain/database/database-connection.mock"

const userId = FakeUserService.getValidUserId()

describe("PostgresFindTasksByUserIdService", () => {
  test("No tasks found => empty array", async () => {
    const { findTasksByUserIdService, connection } = setupTasksNotFound()
    // When
    const foundTasks = await findTasksByUserIdService.execute(userId)
    // Then
    expect(connection.query).toHaveBeenCalledTimes(1)
    expect(foundTasks).toBeArrayOfSize(0)
  })

  test("Tasks found => filled array of tasks with the same userId", async () => {
    const {
      findTasksByUserIdService,
      connection,
      foundTaskFromService1,
      foundTaskFromService2,
      foundTaskFromService3
    } = setupTasksFound()
    // When
    const foundTasks = await findTasksByUserIdService.execute(userId)
    // Then
    expect(connection.query).toHaveBeenCalledTimes(1)
    expect(foundTasks).toBeArrayOfSize(3)
    expect(foundTasks).toIncludeAllMembers([
      foundTaskFromService1,
      foundTaskFromService2,
      foundTaskFromService3
    ])
  })
})

function setupTasksFound() {
  const taskDB1 = FakeTaskService.getTaskDB("1", userId)
  const taskDB2 = FakeTaskService.getTaskDB("2", userId)
  const taskDB3 = FakeTaskService.getTaskDB("3", userId)
  const foundTaskFromService1 = FakeTaskService.getTaskFromService(taskDB1)
  const foundTaskFromService2 = FakeTaskService.getTaskFromService(taskDB2)
  const foundTaskFromService3 = FakeTaskService.getTaskFromService(taskDB3)
  const mockQuery = jest.fn().mockReturnValueOnce([taskDB1, taskDB2, taskDB3])
  const connection = MockConnectionAcceptQuery(mockQuery)()
  const findTasksByUserIdService = new PostgresFindTasksByUserIdService(connection)
  return {
    findTasksByUserIdService,
    connection,
    foundTaskFromService1,
    foundTaskFromService2,
    foundTaskFromService3
  }
}

function setupTasksNotFound() {
  const mockQuery = jest.fn().mockReturnValueOnce([])
  const connection = MockConnectionAcceptQuery(mockQuery)()
  const findTasksByUserIdService = new PostgresFindTasksByUserIdService(connection)
  return { findTasksByUserIdService, connection }
}
