import { TaskDto } from "../../../../../src/domain/types/task.types"

import PostgresFindUserByIdService from "../../../../../src/domain/services/users/implementations/postgres-find-user-by-id.service"
import PostgresFindTaskByIdService from "../../../../../src/domain/services/tasks/implementations/postgres-find-task-by-id.service"
import PostgresUpdateTaskService from "../../../../../src/domain/services/tasks/implementations/postgres-update-task.service"
import UpdateTaskUseCaseImplementation from "../../../../../src/domain/usecases/tasks/implementations/update-task.usecase"

import UserNotFoundByIdError from "../../../../../src/domain/errors/users/user-not-found-by-id.error"
import TaskNotFoundByIdError from "../../../../../src/domain/errors/tasks/task-not-found-by-id.error"

import FakeUserService from "../../../../utils/fakes/user-service.fake"
import FakeTaskService from "../../../../utils/fakes/task-service.fake"
import { getError } from "../../../../utils/functions/error.functions"
import { expectsToHaveError } from "../../../../utils/functions/expects.functions"
import MockConnection, {
  MockConnectionAcceptQuery
} from "../../../../utils/mocks/domain/database/database-connection.mock"

const userId = FakeUserService.getValidUserId()
const taskId = FakeTaskService.getValidTaskId()
const updatedTask: TaskDto = {
  id: taskId,
  name: "Task Name Updated",
  description: "Task Description Updated",
  userId
}
const userDB = FakeUserService.getUserDB("1", userId)
const foundUserFromService = FakeUserService.getUserFromService(userDB)
const taskDB = FakeTaskService.getTaskDB("1", userId, taskId)
const foundTaskFromService = FakeTaskService.getTaskFromService(taskDB)

const connection = MockConnection()
const findTaskByIdService = new PostgresFindTaskByIdService(connection)
const updateTaskService = new PostgresUpdateTaskService(connection)

describe("UpdateTaskUseCaseImplementation", () => {
  test("User not found by id throw UserNotFoundByIdError", async () => {
    const mockQuery = jest.fn().mockReturnValueOnce([]).mockReturnValueOnce([])
    const connection = MockConnectionAcceptQuery(mockQuery)()
    const findUserByIdService = new PostgresFindUserByIdService(connection)
    const updateTaskUseCase = new UpdateTaskUseCaseImplementation(
      findUserByIdService,
      findTaskByIdService,
      updateTaskService
    )
    const foundUser = await findUserByIdService.execute(userId)
    // Given
    expect(connection.query).toHaveBeenCalledTimes(1)
    expect(foundUser).toBeNull()
    // When
    const useCaseErr = await getError(() => updateTaskUseCase.execute(updatedTask))
    // Then
    expect(connection.query).toHaveBeenCalledTimes(2)
    expectsToHaveError(useCaseErr, UserNotFoundByIdError)
  })

  test("User found. But task not found by id throw TaskNotFoundByIdError", async () => {
    const mockQuery = jest
      .fn()
      .mockReturnValueOnce([userDB])
      .mockReturnValueOnce([])
      .mockReturnValueOnce([userDB])
      .mockReturnValueOnce([])
    const connection = MockConnectionAcceptQuery(mockQuery)()
    const findUserByIdService = new PostgresFindUserByIdService(connection)
    const findTaskByIdService = new PostgresFindTaskByIdService(connection)
    const updateTaskUseCase = new UpdateTaskUseCaseImplementation(
      findUserByIdService,
      findTaskByIdService,
      updateTaskService
    )
    const foundUser = await findUserByIdService.execute(userId)
    const foundTask = await findTaskByIdService.execute(taskId)
    // Given
    expect(connection.query).toHaveBeenCalledTimes(2)
    expect(foundUser).toEqual(foundUserFromService)
    expect(foundTask).toBeNull()
    // When
    const useCaseErr = await getError(() => updateTaskUseCase.execute(updatedTask))
    // Then
    expect(connection.query).toHaveBeenCalledTimes(4)
    expectsToHaveError(useCaseErr, TaskNotFoundByIdError)
  })

  test("User found and task found. Executes with no errors", async () => {
    const mockQuery = jest
      .fn()
      .mockReturnValueOnce([userDB])
      .mockReturnValueOnce([taskDB])
      .mockReturnValueOnce([userDB])
      .mockReturnValueOnce([taskDB])
    const connection = MockConnectionAcceptQuery(mockQuery)()
    const findUserByIdService = new PostgresFindUserByIdService(connection)
    const findTaskByIdService = new PostgresFindTaskByIdService(connection)
    const updateTaskUseCase = new UpdateTaskUseCaseImplementation(
      findUserByIdService,
      findTaskByIdService,
      updateTaskService
    )
    const foundUser = await findUserByIdService.execute(userId)
    const foundTask = await findTaskByIdService.execute(taskId)
    // Given
    expect(connection.query).toHaveBeenCalledTimes(2)
    expect(foundUser).toEqual(foundUserFromService)
    expect(foundTask).toEqual(foundTaskFromService)
    // When
    const useCaseErr = await getError(() => updateTaskUseCase.execute(updatedTask))
    // Then
    expect(connection.query).toHaveBeenCalledTimes(4)
    expect(connection.mutate).toHaveBeenCalledTimes(1)
    expect(useCaseErr).toBeFalsy()
  })
})
