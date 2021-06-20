import TaskValidatorImplementation from "../../../../../src/domain/validators/implementations/task.validator"
import UserValidatorImplementation from "../../../../../src/domain/validators/implementations/user.validator"
import CreateTaskServiceImplementation from "../../../../../src/domain/services/tasks/implementations/create-task.service"

import { getError } from "../../../../utils/functions/error.functions"
import FakeUserService from "../../../../utils/fakes/user-service.fake"

describe("CreateTaskServiceImplementation | Execute", () => {
  test("Vaid task should be added with no errors", async () => {
    const userId = FakeUserService.getValidUserId()
    const newTask = {
      name: "TaskName",
      description: "TaskDescription",
      userId
    }
    const mockMutate = jest.fn()
    const MockConnection = jest.fn().mockImplementation(() => ({
      mutate: mockMutate
    }))()
    const createTaskService = new CreateTaskServiceImplementation(MockConnection)
    // Given
    expect(MockConnection.mutate).toBeDefined()
    // When
    const serviceErr = await getError(() => createTaskService.execute(newTask))
    // Then
    expect(serviceErr).toBeFalsy()
    expect(mockMutate).toHaveBeenCalled()
  })
})
