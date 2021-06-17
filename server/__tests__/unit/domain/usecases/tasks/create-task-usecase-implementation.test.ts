import "jest-extended"

import { CreateTaskBody } from "../../../../../src/domain/types/request/body.types"

import CreateTaskUseCase from "../../../../../src/domain/usecases/tasks/create-task-usecase.interface"

import CreateTaskUseCaseImplementation from "../../../../../src/domain/usecases/tasks/implementations/create-task.usecase"

import { getError } from "../../../../utils/functions/error.functions"
import { expectsToHaveError } from "../../../../utils/functions/expects.functions"
import { MockFindUserByIdService } from "../../../../utils/mocks/domain/services/users/find-user-by-id-service.mock"
import {
  MockCreateTaskService,
  MockCreateTaskServiceThrowError
} from "../../../../utils/mocks/domain/services/tasks/create-task-service.mock"
import FakeUserService from "../../../../utils/fakes/user-service.fake"
import { isValidUUIDv4 } from "../../../../utils/functions/validation.functions"

const expectsValidService = (service: any): void => {
  expect(service).toBeTruthy()
  expect(service).toBeObject()
  expect(service.execute).toBeDefined()
}

const findUserByIdService = new MockFindUserByIdService()
const createTaskService = new MockCreateTaskService()

let createTaskUseCase: CreateTaskUseCase
let newTask: CreateTaskBody
let userId: string

beforeEach(() => {
  createTaskUseCase = new CreateTaskUseCaseImplementation(findUserByIdService, createTaskService)
  newTask = {
    name: "task name"
  }
  userId = FakeUserService.getValidUserId()
})

describe("CreateTaskUseCaseImplementation | Execute", () => {
  test("User not found with userId passed throw UserNotFoundByIdError", async () => {
    const userId = null
    const userFound = await findUserByIdService.execute(userId)
    const findUserErr = await getError(() => findUserByIdService.execute(userId))
    // Given
    expect(userId).toBeNull()
    expect(userFound).toBeNull()
    expect(findUserErr).toBeFalsy()
    expectsValidService(findUserByIdService)
    // When
    const useCaseErr = await getError(() => createTaskUseCase.execute(newTask, userId))
    // Then
    expectsToHaveError(useCaseErr)
  })

  test("User found but error to create a task throw error", async () => {
    const userFound = await findUserByIdService.execute(userId)
    const findUserErr = await getError(() => findUserByIdService.execute(userId))
    const createTaskService = new MockCreateTaskServiceThrowError()
    const createTaskErr = await getError(() =>
      createTaskService.execute({ name: newTask.name, description: "", userId })
    )
    const createTaskUseCase = new CreateTaskUseCaseImplementation(findUserByIdService, createTaskService)
    // Given
    expect(userId).toBeTruthy()
    expect(isValidUUIDv4(userId)).toBeTrue()
    expect(userFound).not.toBeNull()
    expect(findUserErr).toBeFalsy()
    expectsToHaveError(createTaskErr)
    expectsValidService(findUserByIdService)
    expectsValidService(createTaskService)
    // When
    const useCaseErr = await getError(() => createTaskUseCase.execute(newTask, userId))
    // Then
    expectsToHaveError(useCaseErr)
  })

  test("User found and task created throws no errors", async () => {
    const userFound = await findUserByIdService.execute(userId)
    const findUserErr = await getError(() => findUserByIdService.execute(userId))
    const createTaskErr = await getError(() =>
      createTaskService.execute({ name: newTask.name, description: "", userId })
    )
    // Given
    expect(userId).toBeTruthy()
    expect(isValidUUIDv4(userId)).toBeTrue()
    expect(userFound).not.toBeNull()
    expect(findUserErr).toBeFalsy()
    expect(createTaskErr).toBeFalsy()
    expectsValidService(findUserByIdService)
    expectsValidService(createTaskService)
    // When
    const useCaseErr = await getError(() => createTaskUseCase.execute(newTask, userId))
    // Then
    expect(useCaseErr).toBeFalsy()
  })
})
