import DeleteTodoService from "../../../services/todos/delete-todo-service.interface"
import FindTodoByIdService from "../../../services/todos/find-todo-by-id-service.interface"
import FindUserByIdService from "../../../services/users/find-user-by-id-service.interface"
import DeleteTodoUseCase from "./delete-todos-usecase.interface"

import UserNotFoundByIdError from "../../../errors/users/user-not-found-by-id.error"
import TodoNotFoundByIdError from "../../../errors/todos/todo-not-found-by-id.error"

export default class DeleteTodoUseCaseImplementation implements DeleteTodoUseCase {
  private readonly errorMessage = "[DeleteTodoUseCase] execute"

  constructor(
    private readonly findUserByIdService: FindUserByIdService,
    private readonly findTodoByIdService: FindTodoByIdService,
    private readonly deleteTodoService: DeleteTodoService
  ) {}

  public async execute(userId: string, todoId: string): Promise<void> {
    const foundUser = await this.findUserByIdService.execute(userId)
    if (foundUser === null) {
      throw new UserNotFoundByIdError(this.errorMessage)
    }
    const foundTodo = await this.findTodoByIdService.execute(todoId)
    if (foundTodo === null) {
      throw new TodoNotFoundByIdError(this.errorMessage)
    }
    await this.deleteTodoService.execute(todoId)
  }
}
