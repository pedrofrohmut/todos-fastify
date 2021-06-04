import CreateTaskControllerImplementation from "./tasks/implementations/create-task.controller"
import DeleteTaskControllerImplementation from "./tasks/implementations/delete-task.controller"
import FindTaskByIdControllerImplementation from "./tasks/implementations/find-task-by-id.controller"
import FindTasksByUserIdControllerImplementation from "./tasks/implementations/find-tasks-by-user-id.controller"
import UpdateTaskControllerImplementation from "./tasks/implementations/update-task.controller"
import ClearCompleteTodoByTaskIdControllerImplementation from "./todos/implementations/clear-complete-todos-by-task-id.controller"
import CreateTodoControllerImplementation from "./todos/implementations/create-todo.controller"
import DeleteTodoControllerImplementation from "./todos/implementations/delete-todo.controller"
import FindTodoByIdControllerImplementation from "./todos/implementations/find-todo-by-id.controller"
import FindTodosByTaskIdControllerImplementation from "./todos/implementations/find-todos-by-task-id.controller"
import SetTodoAsDoneControllerImplementation from "./todos/implementations/set-todo-as-done.controller"
import SetTodoAsNotDoneControllerImplementation from "./todos/implementations/set-todo-as-not-done.controller"
import UpdateTodoControllerImplementation from "./todos/implementations/update-todo.controller"
import CreateUserControllerImplementation from "./users/implementations/create-user.controller"
import GetSignedUserControllerImplementation from "./users/implementations/get-signed-user.controller"
import SignInUserControllerImplementation from "./users/implementations/sign-in-user.controller"

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
    return null
  }
}
