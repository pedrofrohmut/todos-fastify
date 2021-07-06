import { TodoDto } from "../../../types/todo.types"

import FindTodoByIdService from "../../../services/todos/find-todo-by-id-service.interface"
import FindUserByIdService from "../../../services/users/find-user-by-id-service.interface"
import FindTodoByIdUseCase from "../find-todo-by-id-usecase.interface"

import TodoNotFoundByIdError from "../../../errors/todos/todo-not-found-by-id.error"
import UserNotFoundByIdError from "../../../errors/users/user-not-found-by-id.error"

export default class FindTodoByIdUseCaseImplementation implements FindTodoByIdUseCase {
  private readonly errorMessage = "[FindTodoByIdUseCase] execute"

  constructor(
    private readonly findUserByIdService: FindUserByIdService,
    private readonly findTodoByIdService: FindTodoByIdService
  ) {}

  public async execute(userId: string, todoId: string): Promise<TodoDto | null> {
    const foundUser = await this.findUserByIdService.execute(userId)
    if (foundUser === null) {
      throw new UserNotFoundByIdError(this.errorMessage)
    }
    const foundTodo = await this.findTodoByIdService.execute(todoId)
    if (foundTodo === null) {
      throw new TodoNotFoundByIdError(this.errorMessage)
    }
    return foundTodo
  }
}
