import TaskNotFoundByIdError from "../../../errors/tasks/task-not-found-by-id.error"
import UserNotFoundByIdError from "../../../errors/users/user-not-found-by-id.error"
import DeleteTaskService from "../../../services/tasks/delete-task-service.interface"
import FindTaskByIdService from "../../../services/tasks/find-task-by-id-service.interface"
import FindUserByIdService from "../../../services/users/find-user-by-id-service.interface"
import DeleteTaskUseCase from "../delete-task-usecase.interface"

export default class DeleteTaskUseCaseImplementation implements DeleteTaskUseCase {
  private readonly findUserByIdService: FindUserByIdService
  private readonly findTaskByIdService: FindTaskByIdService
  private readonly deleteTaskService: DeleteTaskService

  constructor(
    findUserByIdService: FindUserByIdService,
    findTaskByIdService: FindTaskByIdService,
    deleteTaskService: DeleteTaskService
  ) {
    this.findUserByIdService = findUserByIdService
    this.findTaskByIdService = findTaskByIdService
    this.deleteTaskService = deleteTaskService
  }

  public async execute(userId: string, taskId: string): Promise<void> {
    const errorMessage = "[DeleteTaskUseCase] execute"
    const foundUser = await this.findUserByIdService.execute(userId)
    if (foundUser === null) {
      throw new UserNotFoundByIdError()
    }
    const foundTask = await this.findTaskByIdService.execute(taskId)
    if (foundTask === null) {
      throw new TaskNotFoundByIdError(errorMessage)
    }
    this.deleteTaskService.execute(taskId)
  }
}
