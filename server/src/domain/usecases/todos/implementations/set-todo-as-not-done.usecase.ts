import SetTodoAsNotDoneUseCase from "../set-todo-as-not-done-usecase.interface"
import FindUserByIdService from "../../../services/users/find-user-by-id-service.interface"
import FindTodoByIdService from "../../../services/todos/find-todo-by-id-service.interface"
import SetTodoAsNotDoneService from "../../../services/todos/set-todo-as-not-done-service.interface"

import TodoNotFoundByIdError from "../../../errors/todos/todo-not-found-by-id.error"
import UserNotFoundByIdError from "../../../errors/users/user-not-found-by-id.error"

export default class SetTodoAsNotDoneUseCaseImplementation implements SetTodoAsNotDoneUseCase {
  private readonly errorMessage = "[SetTodoAsNotDoneUseCase] execute"

  constructor(
    private readonly findUserByIdService: FindUserByIdService,
    private readonly findTodoByIdService: FindTodoByIdService,
    private readonly setTodoAsNotDoneService: SetTodoAsNotDoneService
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
    this.setTodoAsNotDoneService.execute(todoId)
  }
}
