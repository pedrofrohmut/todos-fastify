import { TaskDto } from "../../../types/task.types"

import FindTaskByIdUseCase from "../find-task-by-id-usecase.interface"
import FindTaskByIdService from "../../../services/tasks/find-task-by-id-service.interface"
import FindUserByIdService from "../../../services/users/find-user-by-id-service.interface"
import UserNotFoundByIdError from "../../../errors/users/user-not-found-by-id.error"
import TaskNotFoundByIdError from "../../../errors/tasks/task-not-found-by-id.error"

export default class FindTaskByIdUseCaseImplementation implements FindTaskByIdUseCase {
  private readonly errorMessage = "[FindTaskByIdUseCase] execute"

  constructor(
    private readonly findUserByIdService: FindUserByIdService,
    private readonly findTaskByIdService: FindTaskByIdService
  ) {}

  public async execute(userId: string, taskId: string): Promise<TaskDto> {
    const foundUser = await this.findUserByIdService.execute(userId)
    if (foundUser === null) {
      throw new UserNotFoundByIdError(this.errorMessage)
    }
    const foundTask = await this.findTaskByIdService.execute(taskId)
    if (foundTask === null) {
      throw new TaskNotFoundByIdError(this.errorMessage)
    }
    return foundTask
  }
}
