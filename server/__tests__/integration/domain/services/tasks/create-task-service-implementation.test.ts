import TaskValidatorImplementation from "../../../../../src/domain/validators/implementations/task.validator"
import UserValidatorImplementation from "../../../../../src/domain/validators/implementations/user.validator"
import CreateTaskServiceImplementation from "../../../../../src/domain/services/tasks/implementations/create-task.service"

import { getError } from "../../../../utils/functions/error.functions"
import FakeUserService from "../../../../utils/fakes/user-service.fake"

const mockMutate = jest.fn()
const mockConnection = jest.fn().mockImplementation(() => ({
  mutate: mockMutate
}))

beforeEach(() => {
  mockMutate.mockClear()
  mockConnection.mockClear()
})

describe("CreateTaskServiceImplementation | Execute", () => {
  test("Vaid task should be added with no errors", async () => {
    const newTask = {
      name: "TaskName",
      description: "TaskDescription",
      userId: FakeUserService.getValidUserId()
    }
    const taskValidator = new TaskValidatorImplementation()
    const userValidator = new UserValidatorImplementation()
    const createTaskService = new CreateTaskServiceImplementation(mockConnection())
    const taskNameValidationMessage = taskValidator.getMessageForName(newTask.name)
    const taskDescriptionValidationMessage = taskValidator.getMessageForDescription(
      newTask.description
    )
    const userIdValidatonMessage = userValidator.getMessageForId(newTask.userId)
    // Given
    expect(taskNameValidationMessage).toBeNull()
    expect(taskDescriptionValidationMessage).toBeNull()
    expect(userIdValidatonMessage).toBeNull()
    // When
    const serviceErr = await getError(() => createTaskService.execute(newTask))
    // Then
    expect(serviceErr).toBeFalsy()
    expect(mockMutate).toHaveBeenCalled()
  })
})
