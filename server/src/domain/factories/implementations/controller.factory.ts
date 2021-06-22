import { Controller } from "../../types/router.types"

import ControllerFactory from "../controller-factory.interface"
import DatabaseConnection from "../../database/database-connection.interface"
import CreateTaskController from "../../controllers/tasks/create-task-controller.interface"

import CreateTaskControllerImplementation from "../../controllers/tasks/implementations/create-task.controller"
import TaskValidatorImplementation from "../../validators/implementations/task.validator"
import UserValidatorImplementation from "../../validators/implementations/user.validator"
import CreateTaskUseCaseImplementation from "../../usecases/tasks/implementations/create-task.usecase"
import PostgresCreateTaskService from "../../services/tasks/implementations/postgres-create-task.service"
import PostgresFindUserByIdService from "../../services/users/implementations/postgres-find-user-by-id.service"

import DependencyInjectionError from "../../errors/dependencies/dependency-injection.error"
import ControllerNotListedInFactoryError from "../../errors/factories/controller-not-listed-in-the-factory.error"
import CreateUserController from "../../controllers/users/create-user-controller.interface"
import CreateUserControllerImplementation from "../../controllers/users/implementations/create-user.controller"
import CreateUserUseCaseImplementation from "../../usecases/users/implementations/create-user-implementation.usecase"
import PostgresFindUserByEmailService from "../../services/users/implementations/postgres-find-user-by-email.service"
import BcryptjsHashPasswordService from "../../services/auth/implementations/bcryptjs-hash-password.service"
import PostgresCreateUserService from "../../services/users/implementations/postgres-create-user.service"

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
    const findUserByIdService = new PostgresFindUserByIdService(connection)
    const createTaskService = new PostgresCreateTaskService(connection)
    const createTaskUseCase = new CreateTaskUseCaseImplementation(
      findUserByIdService,
      createTaskService
    )
    return new CreateTaskControllerImplementation(taskValidator, userValidator, createTaskUseCase)
  }

  private buildCreateUserController(connection: DatabaseConnection): CreateUserController {
    const userValidator = new UserValidatorImplementation()
    const findUserByEmailService = new PostgresFindUserByEmailService(connection)
    const hashPasswordService = new BcryptjsHashPasswordService()
    const createUserService = new PostgresCreateUserService(connection)
    const createUserUseCase = new CreateUserUseCaseImplementation(
      findUserByEmailService,
      hashPasswordService,
      createUserService
    )
    return new CreateUserControllerImplementation(userValidator, createUserUseCase)
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
    if (controller.toString() === CreateUserControllerImplementation.toString()) {
      return this.buildCreateUserController(connection)
    }
    throw new ControllerNotListedInFactoryError("[ControllerFactoryImplementation] getController")
  }
}
