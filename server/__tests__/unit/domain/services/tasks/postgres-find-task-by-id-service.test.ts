import PostgresFindTaskByIdService from "../../../../../src/domain/services/tasks/implementations/postgres-find-task-by-id.service"

import FakeTaskService from "../../../../utils/fakes/task-service.fake"
import { MockConnectionAcceptQuery } from "../../../../utils/mocks/domain/database/database-connection.mock"
import { TaskTableDto } from "../../../../../src/domain/types/task.types"
import FakeUserService from "../../../../utils/fakes/user-service.fake"

const taskId = FakeTaskService.getValidTaskId()

describe("PostgresFindTaskByIdService | execute", () => {
  test("Task not found => null", async () => {
    const mockQuery = jest.fn(() => [])
    const connection = MockConnectionAcceptQuery(mockQuery)()
    const findTaskByIdService = new PostgresFindTaskByIdService(connection)
    // When
    const foundTask = await findTaskByIdService.execute(taskId)
    // Then
    expect(foundTask).toBeNull()
  })

  test("Task found => TaskDto", async () => {
    const userId = FakeUserService.getValidUserId()
    const taskDB: TaskTableDto = {
      id: taskId,
      name: "Task Name",
      description: "Task Description",
      user_id: userId
    }
    const mockQuery = jest.fn(() => [taskDB])
    const connection = MockConnectionAcceptQuery(mockQuery)()
    const findTaskByIdService = new PostgresFindTaskByIdService(connection)
    // When
    const foundTask = await findTaskByIdService.execute(taskId)
    // Then
    expect(foundTask).toEqual({
      id: taskId,
      name: "Task Name",
      description: "Task Description",
      userId
    })
  })
})
