import CreateTaskServiceImplementation from "../../../../../src/domain/services/tasks/implementations/create-task.service"

import { getError } from "../../../../utils/functions/error.functions"
import { CreateTask } from "../../../../../src/domain/types/task.types"

describe("CreateTaskServiceImplementation", () => {
  test("With valid values throws no errors", async () => {
    // Given
    const newTask: CreateTask = {
      name: "taskName",
      description: "taskDescription",
      userId: "userId"
    }
    const mockMutate = jest.fn(() => {})
    const mockConnection = jest.fn().mockImplementation(() => ({
      mutate: mockMutate
    }))()
    const createTaskService = new CreateTaskServiceImplementation(mockConnection)
    // When
    const serviceErr = await getError(() => createTaskService.execute(newTask))
    // Then
    expect(serviceErr).toBeFalsy()
    expect(mockMutate).toHaveBeenCalled()
  })
})
