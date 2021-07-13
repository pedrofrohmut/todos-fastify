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
import SignInUserControllerImplementation from "../../controllers/users/implementations/sign-in-user.controller"
import SignInUserUseCaseImplementation from "../../usecases/users/implementations/sign-in-user.usecase"
import BcryptjsComparePasswordAndHashService from "../../services/auth/implementations/bcryptjs-compare-password-and-hash.service"
import JwtGenerateAuthTokenService from "../../services/auth/implementations/jwt-generate-auth-token.service"
import SignInUserController from "../../controllers/users/sign-in-user-controller.interface"
import GetSignedUserUseCaseImplementation from "../../usecases/users/implementations/get-signed-user.usecase"
import GetSignedUserController from "../../controllers/users/get-signed-user-controller.interface"
import GetSignedUserControllerImplementation from "../../controllers/users/implementations/get-signed-user.controller"
import CreateTodoController from "../../controllers/todos/create-todo-controller.interface"
import CreateTodoUseCaseImplementation from "../../usecases/todos/implementations/create-todo.usecase"
import PostgresCreateTodoService from "../../services/todos/implementations/postgres-create-todo.service"
import PostgresFindTaskByIdService from "../../services/tasks/implementations/postgres-find-task-by-id.service"
import PostgresFindTasksByUserIdService from "../../services/tasks/implementations/postgres-find-tasks-by-user-id.service"
import TodoValidatorImplementation from "../../validators/implementations/todo.validator"
import CreateTodoControllerImplementation from "../../controllers/todos/implementations/create-todo.controller"
import DeleteTaskController from "../../controllers/tasks/delete-task-controller.interface"
import DeleteTaskUseCaseImplementation from "../../usecases/tasks/implementations/delete-task.usecase"
import PostgresDeleteTaskService from "../../services/tasks/implementations/postgres-delete-task.service"
import DeleteTaskControllerImplementation from "../../controllers/tasks/implementations/delete-task.controller"
import FindTaskByIdController from "../../controllers/tasks/find-task-by-id-controller.interface"
import FindTasksByUserIdUseCaseImplementation from "../../usecases/tasks/implementations/find-tasks-by-user-id.usecase"
import FindTaskByIdUseCaseImplementation from "../../usecases/tasks/implementations/find-task-by-id.usecase"
import FindTaskByIdControllerImplementation from "../../controllers/tasks/implementations/find-task-by-id.controller"
import FindTasksByUserIdControllerImplementation from "../../controllers/tasks/implementations/find-tasks-by-user-id.controller"
import FindTasksByUserIdController from "../../controllers/tasks/find-tasks-by-user-id-controller.interface"
import UpdateTaskController from "../../controllers/tasks/update-task-controller.interface"
import UpdateTaskUseCaseImplementation from "../../usecases/tasks/implementations/update-task.usecase"
import UpdateTaskControllerImplementation from "../../controllers/tasks/implementations/update-task.controller"
import PostgresUpdateTaskService from "../../services/tasks/implementations/postgres-update-task.service"
import ClearCompleteTodosByTaskIdUseCaseImplementation from "../../usecases/todos/implementations/clear-complete-todos-by-task-id.usecase"
import ClearCompleteTodoByTaskIdControllerImplementation from "../../controllers/todos/implementations/clear-complete-todos-by-task-id.controller"
import PostgresClearCompleteTodosByTaskIdService from "../../services/todos/implementations/postgres-clear-complete-todos-by-task-id.service"
import ClearCompleteTodosByTaskIdController from "../../controllers/todos/clear-complete-todos-by-task-id-controller.interface"
import DeleteTodoController from "../../controllers/todos/delete-todo-controller.interface"
import DeleteTodoUseCaseImplementation from "../../usecases/todos/implementations/delete-todo.usecase"
import DeleteTodoControllerImplementation from "../../controllers/todos/implementations/delete-todo.controller"
import PostgresDeleteTodoService from "../../services/todos/implementations/postgres-delete-todo.service"
import PostgresFindTodoByIdService from "../../services/todos/implementations/postgres-find-todo-by-id.service"
import FindTodoByIdUseCaseImplementation from "../../usecases/todos/implementations/find-todo-by-id.usecase"
import FindTodoByIdController from "../../controllers/todos/find-todo-by-id-controller.interface"
import FindTodoByIdControllerImplementation from "../../controllers/todos/implementations/find-todo-by-id.controller"
import FindTodosByTaskIdControllerImplementation from "../../controllers/todos/implementations/find-todos-by-task-id.controller"
import FindTodosByTaskIdController from "../../controllers/todos/find-todos-by-task-id-controller.interface"
import FindTodosByTaskIdUseCaseImplementation from "../../usecases/todos/implementations/find-todos-by-task-id.usecase"
import PostgresFindTodosByTaskIdService from "../../services/todos/implementations/postgres-find-todos-by-task-id.service"
import SetTodoAsDoneUseCaseImplementation from "../../usecases/todos/implementations/set-todo-as-done.usecase"
import SetTodoAsDoneControllerImplementation from "../../controllers/todos/implementations/set-todo-as-done.controller"
import PostgresSetTodoAsDoneService from "../../services/todos/implementations/postgres-set-todo-as-done.service"
import SetTodoAsDoneController from "../../controllers/todos/set-todo-as-done-controller.interface"
import SetTodoAsNotDoneUseCaseImplementation from "../../usecases/todos/implementations/set-todo-as-not-done.usecase"
import PostgresSetTodoAsNotDoneService from "../../services/todos/implementations/postgres-set-todo-as-not-done.service"
import SetTodoAsNotDoneController from "../../controllers/todos/set-todo-as-not-done-controller.interface"
import SetTodoAsNotDoneControllerImplementation from "../../controllers/todos/implementations/set-todo-as-not-done.controller"
import PostgresUpdateTodoService from "../../services/todos/implementations/postgres-update-todo.service"
import UpdateTodoUseCaseImplementation from "../../usecases/todos/implementations/update-todo.usecase"
import UpdateTodoControllerImplementation from "../../controllers/todos/implementations/update-todo.controller"
import UpdateTodoController from "../../controllers/todos/update-todo-controller.interface"

export default class ControllerFactoryImplementation implements ControllerFactory {
  private isValidController(controller: any): boolean {
    if (
      !controller ||
      (typeof controller !== "function" && typeof controller !== "object") ||
      (typeof controller === "object" && controller.execute === undefined)
    ) {
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

  private buildDeleteTaskController(connection: DatabaseConnection): DeleteTaskController {
    const taskValidator = new TaskValidatorImplementation()
    const findUserByIdService = new PostgresFindUserByIdService(connection)
    const findTaskByIdService = new PostgresFindTaskByIdService(connection)
    const deleteTaskService = new PostgresDeleteTaskService(connection)
    const deleteTaskUseCase = new DeleteTaskUseCaseImplementation(
      findUserByIdService,
      findTaskByIdService,
      deleteTaskService
    )
    return new DeleteTaskControllerImplementation(taskValidator, deleteTaskUseCase)
  }

  private buildFindTaskByIdController(connection: DatabaseConnection): FindTaskByIdController {
    const taskValidator = new TaskValidatorImplementation()
    const findUserByIdService = new PostgresFindUserByIdService(connection)
    const findTaskByIdService = new PostgresFindTaskByIdService(connection)
    const findTaskByIdUseCase = new FindTaskByIdUseCaseImplementation(
      findUserByIdService,
      findTaskByIdService
    )
    return new FindTaskByIdControllerImplementation(taskValidator, findTaskByIdUseCase)
  }

  private buildFindTasksByUserIdController(
    connection: DatabaseConnection
  ): FindTasksByUserIdController {
    const userValidator = new UserValidatorImplementation()
    const findUserByIdService = new PostgresFindUserByIdService(connection)
    const findTasksByUserIdService = new PostgresFindTasksByUserIdService(connection)
    const findTasksByUserIdUseCase = new FindTasksByUserIdUseCaseImplementation(
      findUserByIdService,
      findTasksByUserIdService
    )
    return new FindTasksByUserIdControllerImplementation(userValidator, findTasksByUserIdUseCase)
  }

  private buildUpdateTaskController(connection: DatabaseConnection): UpdateTaskController {
    const taskValidator = new TaskValidatorImplementation()
    const findUserByIdService = new PostgresFindUserByIdService(connection)
    const findTaskByIdService = new PostgresFindTaskByIdService(connection)
    const updateTaskService = new PostgresUpdateTaskService(connection)
    const updateTaskUseCase = new UpdateTaskUseCaseImplementation(
      findUserByIdService,
      findTaskByIdService,
      updateTaskService
    )
    return new UpdateTaskControllerImplementation(taskValidator, updateTaskUseCase)
  }

  private buildClearCompleteTodosByTaskIdController(
    connection: DatabaseConnection
  ): ClearCompleteTodosByTaskIdController {
    const taskValidator = new TaskValidatorImplementation()
    const findUserByIdService = new PostgresFindUserByIdService(connection)
    const findTaskByIdService = new PostgresFindTaskByIdService(connection)
    const clearCompleteTodosByTaskIdService = new PostgresClearCompleteTodosByTaskIdService(
      connection
    )
    const clearCompleteTodosByTaskIdUseCase = new ClearCompleteTodosByTaskIdUseCaseImplementation(
      findUserByIdService,
      findTaskByIdService,
      clearCompleteTodosByTaskIdService
    )
    return new ClearCompleteTodoByTaskIdControllerImplementation(
      taskValidator,
      clearCompleteTodosByTaskIdUseCase
    )
  }

  private buildCreateTodoController(connection: DatabaseConnection): CreateTodoController {
    const todoValidator = new TodoValidatorImplementation()
    const taskValidator = new TaskValidatorImplementation()
    const findUserByIdService = new PostgresFindUserByIdService(connection)
    const findTaskByIdService = new PostgresFindTaskByIdService(connection)
    const createTodoService = new PostgresCreateTodoService(connection)
    const createTodoUseCase = new CreateTodoUseCaseImplementation(
      findUserByIdService,
      findTaskByIdService,
      createTodoService
    )
    return new CreateTodoControllerImplementation(todoValidator, taskValidator, createTodoUseCase)
  }

  private buildDeleteTodoController(connection: DatabaseConnection): DeleteTodoController {
    const todoValidator = new TodoValidatorImplementation()
    const findUserByIdService = new PostgresFindUserByIdService(connection)
    const findTodoByIdService = new PostgresFindTodoByIdService(connection)
    const deleteTodoService = new PostgresDeleteTodoService(connection)
    const deleteTodoUseCase = new DeleteTodoUseCaseImplementation(
      findUserByIdService,
      findTodoByIdService,
      deleteTodoService
    )
    return new DeleteTodoControllerImplementation(todoValidator, deleteTodoUseCase)
  }

  private buildFindTodoByIdController(connection: DatabaseConnection): FindTodoByIdController {
    const todoValidator = new TodoValidatorImplementation()
    const findUserByIdService = new PostgresFindUserByIdService(connection)
    const findTodoByIdService = new PostgresFindTodoByIdService(connection)
    const findTodoByIdUseCase = new FindTodoByIdUseCaseImplementation(
      findUserByIdService,
      findTodoByIdService
    )
    return new FindTodoByIdControllerImplementation(todoValidator, findTodoByIdUseCase)
  }

  private buildFindTodosByTaskIdController(
    connection: DatabaseConnection
  ): FindTodosByTaskIdController {
    const taskValidator = new TaskValidatorImplementation()
    const findUserByIdService = new PostgresFindUserByIdService(connection)
    const findTaskByIdService = new PostgresFindTaskByIdService(connection)
    const findTodosByTaskIdService = new PostgresFindTodosByTaskIdService(connection)
    const findTodosByTaskIdUseCase = new FindTodosByTaskIdUseCaseImplementation(
      findUserByIdService,
      findTaskByIdService,
      findTodosByTaskIdService
    )
    return new FindTodosByTaskIdControllerImplementation(taskValidator, findTodosByTaskIdUseCase)
  }

  private buildSetTodoAsDoneController(connection: DatabaseConnection): SetTodoAsDoneController {
    const todoValidator = new TodoValidatorImplementation()
    const findUserByIdService = new PostgresFindUserByIdService(connection)
    const findTodoByIdService = new PostgresFindTodoByIdService(connection)
    const setTodoAsDoneService = new PostgresSetTodoAsDoneService(connection)
    const setTodoAsDoneUseCase = new SetTodoAsDoneUseCaseImplementation(
      findUserByIdService,
      findTodoByIdService,
      setTodoAsDoneService
    )
    return new SetTodoAsDoneControllerImplementation(todoValidator, setTodoAsDoneUseCase)
  }

  private buildSetTodoAsNotDoneController(
    connection: DatabaseConnection
  ): SetTodoAsNotDoneController {
    const todoValidator = new TodoValidatorImplementation()
    const findUserByIdService = new PostgresFindUserByIdService(connection)
    const findTodoByIdService = new PostgresFindTodoByIdService(connection)
    const setTodoAsNotDoneService = new PostgresSetTodoAsNotDoneService(connection)
    const setTodoAsNotDoneUseCase = new SetTodoAsNotDoneUseCaseImplementation(
      findUserByIdService,
      findTodoByIdService,
      setTodoAsNotDoneService
    )
    return new SetTodoAsNotDoneControllerImplementation(todoValidator, setTodoAsNotDoneUseCase)
  }

  private buildUpdateTodoController(connection: DatabaseConnection): UpdateTodoController {
    const todoValidator = new TodoValidatorImplementation()
    const findUserByIdService = new PostgresFindUserByIdService(connection)
    const findTodoByIdService = new PostgresFindTodoByIdService(connection)
    const updateTodoService = new PostgresUpdateTodoService(connection)
    const updateTodoUseCase = new UpdateTodoUseCaseImplementation(
      findUserByIdService,
      findTodoByIdService,
      updateTodoService
    )
    return new UpdateTodoControllerImplementation(todoValidator, updateTodoUseCase)
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

  private buildGetSignedUserController(
    connection: DatabaseConnection,
    secret: string
  ): GetSignedUserController {
    const findUserByIdService = new PostgresFindUserByIdService(connection)
    const generateAuthTokenService = new JwtGenerateAuthTokenService(secret)
    const getSignedUserUseCase = new GetSignedUserUseCaseImplementation(
      findUserByIdService,
      generateAuthTokenService
    )
    return new GetSignedUserControllerImplementation(getSignedUserUseCase)
  }

  private buildSignInUserController(
    connection: DatabaseConnection,
    secret: string
  ): SignInUserController {
    const userValidator = new UserValidatorImplementation()
    const findUserByEmailService = new PostgresFindUserByEmailService(connection)
    const comparePasswordAndHashService = new BcryptjsComparePasswordAndHashService()
    const generateAuthTokenService = new JwtGenerateAuthTokenService(secret)
    const signInUserUseCase = new SignInUserUseCaseImplementation(
      findUserByEmailService,
      comparePasswordAndHashService,
      generateAuthTokenService
    )
    return new SignInUserControllerImplementation(userValidator, signInUserUseCase)
  }

  public getController(
    controller: Function | Controller<any, any>,
    connection: DatabaseConnection
  ): Controller<any, any> {
    if (
      !this.isValidController(controller) ||
      !this.isValidConnection(connection) ||
      !process.env.JWT_SECRET
    ) {
      throw new DependencyInjectionError("[ControllerFactoryImplementation] getController")
    }
    // Tasks
    if (controller.toString() === CreateTaskControllerImplementation.toString()) {
      return this.buildCreateTaskController(connection)
    }
    if (controller.toString() === DeleteTaskControllerImplementation.toString()) {
      return this.buildDeleteTaskController(connection)
    }
    if (controller.toString() === FindTaskByIdControllerImplementation.toString()) {
      return this.buildFindTaskByIdController(connection)
    }
    if (controller.toString() === FindTasksByUserIdControllerImplementation.toString()) {
      return this.buildFindTasksByUserIdController(connection)
    }
    if (controller.toString() === UpdateTaskControllerImplementation.toString()) {
      return this.buildUpdateTaskController(connection)
    }
    // Todos
    if (controller.toString() === ClearCompleteTodoByTaskIdControllerImplementation.toString()) {
      return this.buildClearCompleteTodosByTaskIdController(connection)
    }
    if (controller.toString() === CreateTodoControllerImplementation.toString()) {
      return this.buildCreateTodoController(connection)
    }
    if (controller.toString() === DeleteTodoControllerImplementation.toString()) {
      return this.buildDeleteTodoController(connection)
    }
    if (controller.toString() === FindTodoByIdControllerImplementation.toString()) {
      return this.buildFindTodoByIdController(connection)
    }
    if (controller.toString() === FindTodosByTaskIdControllerImplementation.toString()) {
      return this.buildFindTodosByTaskIdController(connection)
    }
    if (controller.toString() === SetTodoAsDoneControllerImplementation.toString()) {
      return this.buildSetTodoAsDoneController(connection)
    }
    if (controller.toString() === SetTodoAsNotDoneControllerImplementation.toString()) {
      return this.buildSetTodoAsNotDoneController(connection)
    }
    if (controller.toString() === UpdateTodoControllerImplementation.toString()) {
      return this.buildUpdateTodoController(connection)
    }
    // Users
    if (controller.toString() === CreateUserControllerImplementation.toString()) {
      return this.buildCreateUserController(connection)
    }
    if (controller.toString() === GetSignedUserControllerImplementation.toString()) {
      return this.buildGetSignedUserController(connection, process.env.JWT_SECRET)
    }
    if (controller.toString() === SignInUserControllerImplementation.toString()) {
      return this.buildSignInUserController(connection, process.env.JWT_SECRET)
    }
    throw new ControllerNotListedInFactoryError("[ControllerFactoryImplementation] getController")
  }
}
