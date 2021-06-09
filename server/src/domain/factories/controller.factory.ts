import CreateTaskControllerImplementation from "../controllers/tasks/implementations/create-task.controller"
import DeleteTaskControllerImplementation from "../controllers/tasks/implementations/delete-task.controller"
import FindTaskByIdControllerImplementation from "../controllers/tasks/implementations/find-task-by-id.controller"
import FindTasksByUserIdControllerImplementation from "../controllers/tasks/implementations/find-tasks-by-user-id.controller"
import UpdateTaskControllerImplementation from "../controllers/tasks/implementations/update-task.controller"
import ClearCompleteTodoByTaskIdControllerImplementation from "../controllers/todos/implementations/clear-complete-todos-by-task-id.controller"
import CreateTodoControllerImplementation from "../controllers/todos/implementations/create-todo.controller"
import DeleteTodoControllerImplementation from "../controllers/todos/implementations/delete-todo.controller"
import FindTodoByIdControllerImplementation from "../controllers/todos/implementations/find-todo-by-id.controller"
import FindTodosByTaskIdControllerImplementation from "../controllers/todos/implementations/find-todos-by-task-id.controller"
import SetTodoAsDoneControllerImplementation from "../controllers/todos/implementations/set-todo-as-done.controller"
import SetTodoAsNotDoneControllerImplementation from "../controllers/todos/implementations/set-todo-as-not-done.controller"
import UpdateTodoControllerImplementation from "../controllers/todos/implementations/update-todo.controller"
import CreateUserControllerImplementation from "../controllers/users/implementations/create-user.controller"
import GetSignedUserControllerImplementation from "../controllers/users/implementations/get-signed-user.controller"
import SignInUserControllerImplementation from "../controllers/users/implementations/sign-in-user.controller"

export default class ControllerFactory {
  public static getController(controller: Function) {
    if (controller.toString() === CreateTaskControllerImplementation.toString()) {
      return new CreateTaskControllerImplementation()
    }
    if (controller.toString() === DeleteTaskControllerImplementation.toString()) {
      return new DeleteTaskControllerImplementation()
    }
    if (controller.toString() === FindTaskByIdControllerImplementation.toString()) {
      return new FindTaskByIdControllerImplementation()
    }
    if (controller.toString() === FindTasksByUserIdControllerImplementation.toString()) {
      return new FindTasksByUserIdControllerImplementation()
    }
    if (controller.toString() === UpdateTaskControllerImplementation.toString()) {
      return new UpdateTaskControllerImplementation()
    }
    if (controller.toString() === ClearCompleteTodoByTaskIdControllerImplementation.toString()) {
      return new ClearCompleteTodoByTaskIdControllerImplementation()
    }
    if (controller.toString() === CreateTodoControllerImplementation.toString()) {
      return new CreateTodoControllerImplementation()
    }
    if (controller.toString() === DeleteTodoControllerImplementation.toString()) {
      return new DeleteTodoControllerImplementation()
    }
    if (controller.toString() === FindTodoByIdControllerImplementation.toString()) {
      return new FindTodoByIdControllerImplementation()
    }
    if (controller.toString() === FindTodosByTaskIdControllerImplementation.toString()) {
      return new FindTodosByTaskIdControllerImplementation()
    }
    if (controller.toString() === SetTodoAsDoneControllerImplementation.toString()) {
      return new SetTodoAsDoneControllerImplementation()
    }
    if (controller.toString() === SetTodoAsNotDoneControllerImplementation.toString()) {
      return new SetTodoAsNotDoneControllerImplementation()
    }
    if (controller.toString() === UpdateTodoControllerImplementation.toString()) {
      return new UpdateTodoControllerImplementation()
    }
    if (controller.toString() === CreateUserControllerImplementation.toString()) {
      return new CreateUserControllerImplementation()
    }
    if (controller.toString() === GetSignedUserControllerImplementation.toString()) {
      return new GetSignedUserControllerImplementation()
    }
    if (controller.toString() === SignInUserControllerImplementation.toString()) {
      return new SignInUserControllerImplementation()
    }
    throw new Error("[ControllerFactory] Cannot get a controller instance. Controller not listed.")
  }
}
