import { TaskDto } from "../../../types/task.types"

import UserNotFoundByIdError from "../../../errors/users/user-not-found-by-id.error"
import FindTasksByUserIdService from "../../../services/tasks/find-tasks-by-user-id-service.interface"
import FindUserByIdService from "../../../services/users/find-user-by-id-service.interface"
import FindTasksByUserIdUseCase from "../find-tasks-by-user-id-usecase.interface"

export default class FindTasksByUserIdUseCaseImplementation implements FindTasksByUserIdUseCase {
  private readonly errorMessage = "[FindTasksByUserIdUseCase] execute"

  constructor(
    private readonly findUserByIdService: FindUserByIdService,
    private readonly findTasksByUserIdService: FindTasksByUserIdService
  ) {}

  public async execute(userId: string): Promise<TaskDto[]> {
    const foundUser = await this.findUserByIdService.execute(userId)
    if (foundUser === null) {
      throw new UserNotFoundByIdError(this.errorMessage)
    }
    return this.findTasksByUserIdService.execute(userId)
  }
}
