import DatabaseConnection from "../../../database/database-connection.interface"
import CreateTaskUseCase from "../../../usecases/tasks/create-task-usecase.interface"
import CreateTaskController from "../create-task-controller.interface"

import { CreateTaskBody, CreateTaskRequest, CreateTaskResponse } from "../../../types/controller.types"

import ConnectionFactory from "../../../database/connection.factory"
import CreateTaskUseCaseImplementation from "../../../usecases/tasks/implementations/create-task.usecase"
import MissingRequestBodyError from "../../../errors/request/missing-request-body.error"

export default class CreateTaskControllerImplementation implements CreateTaskController {
  private readonly connection: DatabaseConnection
  private readonly createTaskUseCase: CreateTaskUseCase

  constructor(connection: DatabaseConnection, createTaskUseCase: CreateTaskUseCase) {
    this.connection = connection
    this.createTaskUseCase = createTaskUseCase
  }

  public static getInstance() {
    const connection = ConnectionFactory.getConnection()
    const createTaskUseCase = new CreateTaskUseCaseImplementation()
    return new CreateTaskControllerImplementation(connection, createTaskUseCase)
  }

  public async execute(request: CreateTaskRequest): Promise<CreateTaskResponse> {
    if (request.body === null) {
      return { status: 400, body: MissingRequestBodyError.message }
    }
    const { name, description } = request.body
    const { userId } = request.params
    const newTask: CreateTaskBody = { name, description }
    try {
      await this.connection.open()
      await this.createTaskUseCase.execute(newTask, userId)
      return { status: 201 }
    } catch (err) {
      return { status: 500, body: "[Controller] Error to create a task. " + err.message }
    } finally {
      await this.connection.close()
    }
  }
}
