import FindTodoByIdService from "../../../services/todos/find-todo-by-id-service.interface"
import SetTodoAsDoneService from "../../../services/todos/set-todo-as-done-service.interface"
import FindUserByIdService from "../../../services/users/find-user-by-id-service.interface"
import SetTodoAsDoneUseCase from "../set-todo-as-done-usecase.interface"

import TodoNotFoundByIdError from "../../../errors/todos/todo-not-found-by-id.error"
import UserNotFoundByIdError from "../../../errors/users/user-not-found-by-id.error"

export default class SetTodoAsDoneUseCaseImplementation implements SetTodoAsDoneUseCase {
  private readonly errorMessage = "[SetTodoAsDoneUseCase] execute"

  constructor(
    private readonly findUserByIdService: FindUserByIdService,
    private readonly findTodoByIdService: FindTodoByIdService,
    private readonly setTodoAsDoneService: SetTodoAsDoneService
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
    this.setTodoAsDoneService.execute(todoId)
  }
}
