import { CreateTodoDto } from "../../../types/todo.types"

import FindUserByIdService from "../../../services/users/find-user-by-id-service.interface"
import FindTaskByIdService from "../../../services/tasks/find-task-by-id-service.interface"
import CreateTodoService from "../../../services/todos/create-todo-service.interface"
import CreateTodoUseCase from "../create-todo-usecase.interface"

import UserNotFoundByIdError from "../../../errors/users/user-not-found-by-id.error"
import TaskNotFoundByIdError from "../../../errors/tasks/task-not-found-by-id.error"

export default class CreateTodoUseCaseImplementation implements CreateTodoUseCase {
  private readonly errorMessage = "[CreateTodoUseCase] execute"

  constructor(
    private readonly findUserByIdService: FindUserByIdService,
    private readonly findTaskByIdService: FindTaskByIdService,
    private readonly createTodoService: CreateTodoService
  ) {}

  public async execute(newTodo: CreateTodoDto): Promise<void> {
    const foundUser = await this.findUserByIdService.execute(newTodo.userId)
    if (foundUser === null) {
      throw new UserNotFoundByIdError(this.errorMessage)
    }
    const foundTask = await this.findTaskByIdService.execute(newTodo.taskId)
    if (foundTask === null) {
      throw new TaskNotFoundByIdError(this.errorMessage)
    }
    await this.createTodoService.execute(newTodo)
  }
}
