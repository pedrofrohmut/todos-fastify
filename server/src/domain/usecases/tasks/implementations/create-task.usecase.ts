import { CreateTaskBody } from "../../../types/request/body.types"

import CreateTaskService from "../../../services/tasks/create-task-service.interface"
import FindUserByIdService from "../../../services/users/find-user-by-id-service.interface"
import CreateTaskUseCase from "../create-task-usecase.interface"

import UserNotFoundByIdError from "../../../errors/users/user-not-found-by-id.error"

export default class CreatTaskUseCaseImplementation implements CreateTaskUseCase {
  private readonly findUserByIdService: FindUserByIdService
  private readonly createTaskService: CreateTaskService

  constructor(findUserByIdService: FindUserByIdService, createTaskService: CreateTaskService) {
    this.findUserByIdService = findUserByIdService
    this.createTaskService = createTaskService
  }

  public async execute(newTask: CreateTaskBody, userId: string): Promise<void> {
    const foundUser = await this.findUserByIdService.execute(userId)
    if (foundUser === null) {
      throw new UserNotFoundByIdError("[CreateTaskUseCase] execute")
    }
    await this.createTaskService.execute({
      name: newTask.name,
      description: newTask.description || "",
      userId
    })
  }
}
