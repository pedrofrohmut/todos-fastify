import { TodoDto } from "../../../types/todo.types"

import FindTodosByTaskIdUseCase from "../find-todos-by-task-id-usecase.interface"
import FindUserByIdService from "../../../services/users/find-user-by-id-service.interface"

import UserNotFoundByIdError from "../../../errors/users/user-not-found-by-id.error"
import FindTaskByIdService from "../../../services/tasks/find-task-by-id-service.interface"
import FindTodosByTaskIdService from "../../../services/todos/find-todos-by-task-id-service.interface"
import TaskNotFoundByIdError from "../../../errors/tasks/task-not-found-by-id.error"

export default class FindTodosByTaskIdUseCaseImplementation implements FindTodosByTaskIdUseCase {
  private readonly errorMessage = "[FindTodosByTaskIdUseCase] execute"

  constructor(
    private readonly findUserByIdService: FindUserByIdService,
    private readonly findTaskByIdService: FindTaskByIdService,
    private readonly findTodosByTaskIdService: FindTodosByTaskIdService
  ) {}

  public async execute(userId: string, taskId: string): Promise<TodoDto[]> {
    const foundUser = await this.findUserByIdService.execute(userId)
    if (foundUser === null) {
      throw new UserNotFoundByIdError(this.errorMessage)
    }
    const foundTask = await this.findTaskByIdService.execute(taskId)
    if (foundTask === null) {
      throw new TaskNotFoundByIdError(this.errorMessage)
    }
    return this.findTodosByTaskIdService.execute(taskId)
  }
}
