import { Controller } from "../../types/router.types"

import ControllerFactory from "../controller-factory.interface"
import DatabaseConnection from "../../database/database-connection.interface"
import CreateTaskController from "../../controllers/tasks/create-task-controller.interface"

import CreateTaskControllerImplementation from "../../controllers/tasks/implementations/create-task.controller"
import TaskValidatorImplementation from "../../validators/implementations/task.validator"
import UserValidatorImplementation from "../../validators/implementations/user.validator"
import CreateTaskUseCaseImplementation from "../../usecases/tasks/implementations/create-task.usecase"
import CreateTaskServiceImplementation from "../../services/tasks/implementations/create-task.service"
import FindUserByIdServiceImplementation from "../../services/users/implementations/find-user-by-id.service"

import DependencyInjectionError from "../../errors/dependencies/dependency-injection.error"
import ControllerNotListedInFactoryError from "../../errors/factories/controller-not-listed-in-the-factory.error"

export default class ControllerFactoryImplementation implements ControllerFactory {
  private isValidController(controller: any): boolean {
    if (typeof controller !== "function" && typeof controller !== "object") {
      return false
    }
    return true
  }

  private isValidConnection(connection: any): boolean {
    if (!connection || typeof connection !== "object") {
      return false
    }
    return true
  }

  private buildCreateTaskController(connection: DatabaseConnection): CreateTaskController {
      const taskValidator = new TaskValidatorImplementation()
      const userValidator = new UserValidatorImplementation()
      const findUserByIdService = new FindUserByIdServiceImplementation(connection)
      const createTaskService = new CreateTaskServiceImplementation(connection)
      const createTaskUseCase = new CreateTaskUseCaseImplementation(
        findUserByIdService,
        createTaskService
      )
      return new CreateTaskControllerImplementation(taskValidator, userValidator, createTaskUseCase)
  }

  public getController(
    controller: Function | Controller<any, any>,
    connection: DatabaseConnection
  ): Controller<any, any> {
    if (!this.isValidController(controller) || !this.isValidConnection(connection)) {
      throw new DependencyInjectionError("[ControllerFactoryImplementation] getController")
    }
    if (controller.toString() === CreateTaskControllerImplementation.toString()) {
      return this.buildCreateTaskController(connection)
    }
    throw new ControllerNotListedInFactoryError("[ControllerFactoryImplementation] getController")
  }
}
