import PostgresCreateTaskService from "../../../../../src/domain/services/tasks/implementations/postgres-create-task.service"
import PostgresFindUserByIdService from "../../../../../src/domain/services/users/implementations/postgres-find-user-by-id.service"
import { CreateTaskBody } from "../../../../../src/domain/types/request/body.types"
import CreateTaskUseCaseImplementation from "../../../../../src/domain/usecases/tasks/implementations/create-task.usecase"

import FakeUserService from "../../../../utils/fakes/user-service.fake"
import { getError } from "../../../../utils/functions/error.functions"
import { expectsToHaveError } from "../../../../utils/functions/expects.functions"
import MockConnection, {
  MockConnectionAcceptMutate,
  MockConnectionAcceptQuery,
  MockConnectionAcceptQueryAndMutate
} from "../../../../utils/mocks/domain/database/database-connection.mock"

const connection = MockConnection()

const userId = FakeUserService.getValidUserId()
const createTaskService = new PostgresCreateTaskService(connection)

let newTask: CreateTaskBody

beforeEach(() => {
  newTask = {
    name: "Task Name"
  }
})

describe("CreateTaskUseCaseImplementation | Execute", () => {
  test("User not found with userId passed throw UserNotFoundByIdError", async () => {
    const mockQuery = jest.fn(() => [])
    const connection = MockConnectionAcceptQuery(mockQuery)()
    const findUserByIdService = new PostgresFindUserByIdService(connection)
    const createTaskUseCase = new CreateTaskUseCaseImplementation(
      findUserByIdService,
      createTaskService
    )
    const userFound = await findUserByIdService.execute(userId)
    // Given
    expect(userFound).toBeNull()
    // When
    const useCaseErr = await getError(() => createTaskUseCase.execute(newTask, userId))
    // Then
    expectsToHaveError(useCaseErr)
  })

  test("User found but error to create a task throw error", async () => {
    const mockQuery = jest.fn(() => [
      {
        id: userId,
        name: "user name",
        email: "user@mail.com",
        password_hash: "user_hash"
      }
    ])
    const mockMutate = jest.fn(() => {
      throw new Error("Mock Mutate Error")
    })
    const connection = MockConnectionAcceptQueryAndMutate(mockQuery, mockMutate)()
    const findUserByIdService = new PostgresFindUserByIdService(connection)
    const createTaskService = new PostgresCreateTaskService(connection)
    const createTaskUseCase = new CreateTaskUseCaseImplementation(
      findUserByIdService,
      createTaskService
    )
    const userFound = await findUserByIdService.execute(userId)
    const createTaskErr = await getError(() =>
      createTaskService.execute({ name: newTask.name, description: "", userId })
    )
    // Given
    expect(userFound).not.toBeNull()
    expectsToHaveError(createTaskErr)
    // When
    const useCaseErr = await getError(() => createTaskUseCase.execute(newTask, userId))
    // Then
    expectsToHaveError(useCaseErr)
  })

  test("User found and task created throws no errors", async () => {
    const mockQuery = jest.fn(() => [
      {
        id: userId,
        name: "user name",
        email: "user@mail.com",
        password_hash: "user_hash"
      }
    ])
    const connection = MockConnectionAcceptQuery(mockQuery)()
    const findUserByIdService = new PostgresFindUserByIdService(connection)
    const createTaskUseCase = new CreateTaskUseCaseImplementation(
      findUserByIdService,
      createTaskService
    )
    const userFound = await findUserByIdService.execute(userId)
    const createTaskErr = await getError(() =>
      createTaskService.execute({ name: newTask.name, description: "", userId })
    )
    // Given
    expect(userFound).not.toBeNull()
    expect(createTaskErr).toBeFalsy()
    // When
    const useCaseErr = await getError(() => createTaskUseCase.execute(newTask, userId))
    // Then
    expect(useCaseErr).toBeFalsy()
  })
})
