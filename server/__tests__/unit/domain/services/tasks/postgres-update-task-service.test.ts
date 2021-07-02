import { UpdateTaskBody } from "../../../../../src/domain/types/request/body.types"

import PostgresUpdateTaskService from "../../../../../src/domain/services/tasks/implementations/postgres-update-task.service"

import { getError } from "../../../../utils/functions/error.functions"
import MockConnection from "../../../../utils/mocks/domain/database/database-connection.mock"

describe("PostgresUpdateTaskService", () => {
  test("Task should be updated with no errors", async () => {
    const updatedTask: UpdateTaskBody = { name: "Task Name Updated" }
    const connection = MockConnection()
    const updateTaskService = new PostgresUpdateTaskService(connection)
    // When
    const serviceErr = await getError(() => updateTaskService.execute(updatedTask))
    // Then
    expect(connection.mutate).toHaveBeenCalledTimes(1)
    expect(serviceErr).toBeFalsy()
  })
})
