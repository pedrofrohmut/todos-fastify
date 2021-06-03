import DatabaseConnection from "../../../../../src/domain/database/database-connection.interface"
import CreateTaskUseCase from "../../../../../src/domain/usecases/tasks/create-task-usecase.interface"

import { CreateTaskBody, CreateTaskRequest } from "../../../../../src/domain/types/controller.types"

import CreateTaskControllerImplementation from "../../../../../src/domain/controllers/tasks/implementations/create-task.controller"

import FakeTaskService from "../../../../utils/fakes/fake-task.service"
import FakeTokenService from "../../../../utils/fakes/fake-token.service"

class MockDatabaseConnection implements DatabaseConnection {
  async open(): Promise<void> {}
  async close(): Promise<void> {}
}

class MockCreateTaskUseCase implements CreateTaskUseCase {
  async execute(_newTask: CreateTaskBody, _userId: string): Promise<void> {}
}

describe("CreateTaskController", () => {
  test("Valid Request", async () => {
    const { name, description, userId } = FakeTaskService.getNew()
    const mockConnection: DatabaseConnection = new MockDatabaseConnection()
    const mockUseCase: CreateTaskUseCase = new MockCreateTaskUseCase()
    const authenticationToken = FakeTokenService.getValid()
    const mockRequest: CreateTaskRequest = {
      body: {
        name,
        description
      },
      headers: {
        authenticationToken
      },
      params: {
        userId
      }
    }
    let result = undefined
    let controllerErr = undefined
    try {
      const controller = new CreateTaskControllerImplementation(mockConnection, mockUseCase)
      result = await controller.execute(mockRequest)
    } catch (err) {
      controllerErr = err
    }
    expect(controllerErr).not.toBeDefined()
    expect(result).toBeDefined()
    expect(result.status).toBe(201)
    expect(result.body).not.toBeDefined()
  })
})
