import ConnectionFactory from "../database/connection.factory"

import CreateTaskControllerImplementation from "./tasks/implementations/create-task.controller"

import CreateTaskUseCaseImplementation from "../usecases/tasks/implementations/create-task.usecase"

export default class ControllerFactory {
  public static getController(controller: any) {
    if (controller.toString() === CreateTaskControllerImplementation.toString()) {
      const connection = ConnectionFactory.getConnection()
      const createTaskUseCase = new CreateTaskUseCaseImplementation()
      return new CreateTaskControllerImplementation(connection, createTaskUseCase)
    }

    return null
  }
}
