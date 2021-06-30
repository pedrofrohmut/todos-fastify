import { CreateTaskBody } from "../../../types/request/body.types"

import CreateTaskService from "../../../services/tasks/create-task-service.interface"
import FindUserByIdService from "../../../services/users/find-user-by-id-service.interface"
import CreateTaskUseCase from "../create-task-usecase.interface"

import UserNotFoundByIdError from "../../../errors/users/user-not-found-by-id.error"

export default class CreatTaskUseCaseImplementation implements CreateTaskUseCase {
  private readonly errorMessage = "[CreateTaskUseCase] execute"

  constructor(
    private readonly findUserByIdService: FindUserByIdService,
    private readonly createTaskService: CreateTaskService
  ) {}

  public async execute(newTask: CreateTaskBody, userId: string): Promise<void> {
    const foundUser = await this.findUserByIdService.execute(userId)
    if (foundUser === null) {
      throw new UserNotFoundByIdError(this.errorMessage)
    }
    await this.createTaskService.execute({
      name: newTask.name,
      description: newTask.description || "",
      userId
    })
  }
}
