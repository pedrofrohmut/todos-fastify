import "jest-extended"

import PostgresFindTasksByUserIdService from "../../../../../src/domain/services/tasks/implementations/postgres-find-tasks-by-user-id.service"

import FakeTaskService from "../../../../utils/fakes/task-service.fake"
import FakeUserService from "../../../../utils/fakes/user-service.fake"
import { MockConnectionAcceptQuery } from "../../../../utils/mocks/domain/database/database-connection.mock"

const userId = FakeUserService.getValidUserId()
const taskDB1 = FakeTaskService.getTaskDB("1", userId)
const taskDB2 = FakeTaskService.getTaskDB("2", userId)
const taskDB3 = FakeTaskService.getTaskDB("3", userId)

describe("PostgresFindTasksByUserIdService", () => {
  test("No tasks found => empty TaskDto[]", async () => {
    const mockQuery = jest.fn().mockReturnValueOnce([])
    const connection = MockConnectionAcceptQuery(mockQuery)()
    const findTasksByUserIdService = new PostgresFindTasksByUserIdService(connection)
    // When
    const foundTasks = await findTasksByUserIdService.execute(userId)
    // Then
    expect(foundTasks).toBeArray()
    expect(foundTasks).toHaveLength(0)
  })

  test("Tasks found => TaskDto[]", async () => {
    const mockQuery = jest.fn().mockReturnValueOnce([taskDB1, taskDB2, taskDB3])
    const connection = MockConnectionAcceptQuery(mockQuery)()
    const findTasksByUserIdService = new PostgresFindTasksByUserIdService(connection)
    // When
    const foundTasks = await findTasksByUserIdService.execute(userId)
    // Then
    expect(foundTasks).toBeArray()
    expect(foundTasks).toHaveLength(3)
    foundTasks.forEach(task => {
      expect(task.userId).toBe(userId)
    })
  })
})
