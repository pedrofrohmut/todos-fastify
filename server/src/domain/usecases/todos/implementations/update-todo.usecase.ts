import { UpdateTodoBody } from "../../../types/request/body.types"

import UpdateTodoUseCase from "../update-todo-usecase.interface"
import FindTodoByIdService from "../../../services/todos/find-todo-by-id-service.interface"
import UpdateTodoService from "../../../services/todos/update-todo-service.interface"
import FindUserByIdService from "../../../services/users/find-user-by-id-service.interface"

import UserNotFoundByIdError from "../../../errors/users/user-not-found-by-id.error"
import TodoNotFoundByIdError from "../../../errors/todos/todo-not-found-by-id.error"

export default class UpdateTodoUseCaseImplementation implements UpdateTodoUseCase {
  private readonly errorMessage = "[UpdateTodoUseCase] execute"

  constructor(
    private readonly findUserByIdService: FindUserByIdService,
    private readonly findTodoByIdService: FindTodoByIdService,
    private readonly updateTodoService: UpdateTodoService
  ) {}

  public async execute(userId: string, todoId: string, updatedTodo: UpdateTodoBody): Promise<void> {
    const foundUser = await this.findUserByIdService.execute(userId)
    if (foundUser === null) {
      throw new UserNotFoundByIdError(this.errorMessage)
    }
    const foundTodo = await this.findTodoByIdService.execute(todoId)
    if (foundTodo === null) {
      throw new TodoNotFoundByIdError(this.errorMessage)
    }
    await this.updateTodoService.execute({ ...updatedTodo, id: todoId })
  }
}
