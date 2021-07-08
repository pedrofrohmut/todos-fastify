import "jest-extended"

import { UpdateTaskDto } from "../../../../../src/domain/types/task.types"

import PostgresUpdateTaskService from "../../../../../src/domain/services/tasks/implementations/postgres-update-task.service"

import { getError } from "../../../../utils/functions/error.functions"
import MockConnection from "../../../../utils/mocks/domain/database/database-connection.mock"
import FakeTaskService from "../../../../utils/fakes/task-service.fake"

const taskId = FakeTaskService.getValidTaskId()
const connection = MockConnection()
const updateTaskService = new PostgresUpdateTaskService(connection)

describe("PostgresUpdateTaskService", () => {
  test("Task with no description should be updated with no errors", async () => {
    const updatedTask: UpdateTaskDto = { id: taskId, name: "Task Name Updated" }
    // When
    const serviceErr = await getError(() => updateTaskService.execute(updatedTask))
    // Then
    expect(connection.mutate).toHaveBeenCalledTimes(1)
    const paramsPassedToDatabase = connection.mutate.mock.calls[0][1]
    expect(paramsPassedToDatabase).toIncludeAllMembers([updatedTask.name, "", updatedTask.id])
    expect(serviceErr).toBeFalsy()
  })

  test("Task with description should be updated with no errors", async () => {
    const updatedTask: UpdateTaskDto = {
      id: taskId,
      name: "Task Name Updated",
      description: "Task Description Updated"
    }
    // When
    const serviceErr = await getError(() => updateTaskService.execute(updatedTask))
    // Then
    expect(connection.mutate).toHaveBeenCalledTimes(1)
    const paramsPassedToDatabase = connection.mutate.mock.calls[0][1]
    expect(paramsPassedToDatabase).toIncludeAllMembers([
      updatedTask.name,
      updatedTask.description,
      updatedTask.id
    ])
    expect(serviceErr).toBeFalsy()
  })
})
