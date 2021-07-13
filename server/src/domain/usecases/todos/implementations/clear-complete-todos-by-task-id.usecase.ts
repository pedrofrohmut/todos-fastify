import ClearCompleteTodosByTaskIdUseCase from "../clear-complete-todos-by-task-id-usecase.interface"
import FindUserByIdService from "../../../services/users/find-user-by-id-service.interface"
import FindTaskByIdService from "../../../services/tasks/find-task-by-id-service.interface"
import ClearCompleteTodosByTaskIdService from "../../../services/todos/clear-complete-todos-by-task-id-service.interface"
import UserNotFoundByIdError from "../../../errors/users/user-not-found-by-id.error"
import TaskNotFoundByIdError from "../../../errors/tasks/task-not-found-by-id.error"

export default class ClearCompleteTodosByTaskIdUseCaseImplementation
  implements ClearCompleteTodosByTaskIdUseCase
{
  private readonly errorMessage = "[ClearCompleteTodosByTaskIdUseCase] execute"

  constructor(
    private readonly findUserByIdService: FindUserByIdService,
    private readonly findTaskByIdService: FindTaskByIdService,
    private readonly clearCompleteTodosByTaskIdService: ClearCompleteTodosByTaskIdService
  ) {}

  public async execute(userId: string, taskId: string): Promise<void> {
    const foundUser = await this.findUserByIdService.execute(userId)
    if (foundUser === null) {
      throw new UserNotFoundByIdError(this.errorMessage)
    }
    const foundTask = await this.findTaskByIdService.execute(taskId)
    if (foundTask === null) {
      throw new TaskNotFoundByIdError(this.errorMessage)
    }
    await this.clearCompleteTodosByTaskIdService.execute(taskId)
  }
}
