import { CreateTask } from "../../../../../src/domain/types/task.types"

import PostgresCreateTaskService from "../../../../../src/domain/services/tasks/implementations/postgres-create-task.service"

import { getError } from "../../../../utils/functions/error.functions"
import FakeUserService from "../../../../utils/fakes/user-service.fake"
import {
  expectsValidConnection,
  expectsValidService
} from "../../../../utils/functions/expects.functions"
import { MockConnectionAcceptMutate } from "../../../../utils/mocks/domain/database/database-connection.mock"

describe("CreateTaskServiceImplementation | Execute", () => {
  test("Valid task should be added with no errors", async () => {
    const userId = FakeUserService.getValidUserId()
    const newTask: CreateTask = {
      name: "TaskName",
      description: "TaskDescription",
      userId
    }
    const mockMutate = jest.fn()
    const connection = MockConnectionAcceptMutate(mockMutate)()
    const createTaskService = new PostgresCreateTaskService(connection)
    // Given
    expectsValidConnection(connection)
    expectsValidService(createTaskService)
    // @ts-ignore
    expect(createTaskService.connection).toBeTruthy()
    // When
    const serviceErr = await getError(() => createTaskService.execute(newTask))
    // Then
    expect(serviceErr).toBeFalsy()
    expect(mockMutate).toHaveBeenCalledTimes(1)
  })
})
