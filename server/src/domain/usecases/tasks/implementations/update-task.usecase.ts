import { TaskDto } from "../../../types/task.types"

import UpdateTaskUseCase from "../update-task-usecase.interface"
import FindUserByIdService from "../../../services/users/find-user-by-id-service.interface"
import FindTaskByIdService from "../../../services/tasks/find-task-by-id-service.interface"
import UpdateTaskService from "../../../services/tasks/update-task-service.interface"

import UserNotFoundByIdError from "../../../errors/users/user-not-found-by-id.error"
import TaskNotFoundByIdError from "../../../errors/tasks/task-not-found-by-id.error"

export default class UpdateTaskUseCaseImplementation implements UpdateTaskUseCase {
  private readonly errorMessage = "[UpdateTaskUseCase] execute"

  constructor(
    private readonly findUserByIdService: FindUserByIdService,
    private readonly findTaskByIdService: FindTaskByIdService,
    private readonly updateTaskService: UpdateTaskService
  ) {}

  public async execute(updatedTask: TaskDto): Promise<void> {
    const userFound = await this.findUserByIdService.execute(updatedTask.userId)
    if (userFound === null) {
      throw new UserNotFoundByIdError(this.errorMessage)
    }
    const foundTask = await this.findTaskByIdService.execute(updatedTask.id)
    if (foundTask === null) {
      throw new TaskNotFoundByIdError(this.errorMessage)
    }
    this.updateTaskService.execute(updatedTask)
  }
}
