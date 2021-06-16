import { CreateTaskBody } from "../../../types/request/body.types"
import { AdaptedRequest, ControllerResponse } from "../../../types/router.types"

import CreateTaskController from "../create-task-controller.interface"
import TaskValidator from "../../../validators/task-validator.interface"

import MissingRequestBodyError from "../../../errors/controllers/missing-request-body.error"
import MissingRequestAuthUserIdError from "../../../errors/controllers/missing-request-auth-user-id.error"
import CreateTaskUseCase from "../../../usecases/tasks/create-task-usecase.interface"
import UserNotFoundByIdError from "../../../errors/users/user-not-found-by-id.error"

export default class CreateTaskControllerImplementation implements CreateTaskController {
  private readonly taskValidator: TaskValidator
  private readonly createTaskUseCase: CreateTaskUseCase

  constructor(taskValidator: TaskValidator, createTaskUseCase: CreateTaskUseCase) {
    this.taskValidator = taskValidator
    this.createTaskUseCase = createTaskUseCase
  }

  private getValidationMessageForBody(body: CreateTaskBody): null | string {
    if (body === null) {
      return new MissingRequestBodyError("[CreateTaskController] getValidationMessageForBody")
        .message
    }
    const nameValidationMessage = this.taskValidator.getMessageForName(body.name)
    if (nameValidationMessage !== null) {
      return nameValidationMessage
    }
    return null
  }

  public async execute(request: AdaptedRequest<CreateTaskBody>): Promise<ControllerResponse<void>> {
    const bodyValidationMessage = this.getValidationMessageForBody(request.body as CreateTaskBody)
    if (bodyValidationMessage !== null) {
      return { status: 400, body: bodyValidationMessage }
    }
    if (request.authUserId === null) {
      return {
        status: 401,
        body: new MissingRequestAuthUserIdError("[CreateTaskController] execute").message
      }
    }
    try {
      await this.createTaskUseCase.execute(request.body!, request.authUserId)
      return { status: 201 }
    } catch (err) {
      if (err instanceof UserNotFoundByIdError) {
        return {
          status: 400,
          body: new UserNotFoundByIdError("[CreateTaskController] execute").message
        }
      }
      throw err
    }
  }
}
