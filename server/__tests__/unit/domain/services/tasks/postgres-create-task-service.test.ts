import { CreateTaskDto } from "../../../../../src/domain/types/task.types"

import PostgresCreateTaskService from "../../../../../src/domain/services/tasks/implementations/postgres-create-task.service"

import { getError } from "../../../../utils/functions/error.functions"
import FakeUserService from "../../../../utils/fakes/user-service.fake"
import MockConnection from "../../../../utils/mocks/domain/database/database-connection.mock"

describe("CreateTaskServiceImplementation | Execute", () => {
  test("Valid task should be added with no errors", async () => {
    const userId = FakeUserService.getValidUserId()
    const newTask: CreateTaskDto = {
      name: "TaskName",
      description: "TaskDescription",
      userId
    }
    const connection = MockConnection()
    const createTaskService = new PostgresCreateTaskService(connection)
    // When
    const serviceErr = await getError(() => createTaskService.execute(newTask))
    // Then
    expect(connection.mutate).toHaveBeenCalledTimes(1)
    expect(serviceErr).toBeFalsy()
  })
})
