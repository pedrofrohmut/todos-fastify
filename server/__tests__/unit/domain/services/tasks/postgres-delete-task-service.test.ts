import { TaskTableDto } from "../../../../../src/domain/types/task.types"

import PostgresFindTaskByIdService from "../../../../../src/domain/services/tasks/implementations/postgres-find-task-by-id.service"
import PostgresDeleteTaskService from "../../../../../src/domain/services/tasks/implementations/postgres-delete-task.service"

import FakeUserService from "../../../../utils/fakes/user-service.fake"
import FakeTaskService from "../../../../utils/fakes/task-service.fake"
import { MockConnectionAcceptQueryAndMutate } from "../../../../utils/mocks/domain/database/database-connection.mock"
import { getError } from "../../../../utils/functions/error.functions"

describe("PostgresDeleteTaskService | execute", () => {
  test("Existing task should deleted with no errors", async () => {
    const taskId = FakeTaskService.getValidTaskId()
    const userId = FakeUserService.getValidUserId()
    const taskDB: TaskTableDto = { id: taskId, name: "Task Name", description: "", user_id: userId }
    const mockQuery = jest.fn(() => [taskDB])
    const mockMutate = jest.fn()
    const connection = MockConnectionAcceptQueryAndMutate(mockQuery, mockMutate)()
    const findTaskByIdService = new PostgresFindTaskByIdService(connection)
    const deleteTaskService = new PostgresDeleteTaskService(connection)
    const foundTask = await findTaskByIdService.execute(taskId)
    // Given
    expect(foundTask).not.toBeNull()
    // When
    const deleteErr = await getError(() => deleteTaskService.execute(taskId))
    // Then
    expect(deleteErr).toBeFalsy()
    expect(connection.mutate).toHaveBeenCalledTimes(1)
  })
})
