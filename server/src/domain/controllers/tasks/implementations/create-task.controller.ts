import { CreateTaskBody } from "../../../types/request/body.types"
import { AdaptedRequest, ControllerResponse } from "../../../types/router.types"

import CreateTaskController from "../create-task-controller.interface"
import TaskValidator from "../../../validators/task-validator.interface"
import UserValidator from "../../../validators/user-validator.interface"
import CreateTaskUseCase from "../../../usecases/tasks/create-task-usecase.interface"

import MissingRequestBodyError from "../../../errors/controllers/missing-request-body.error"
import MissingRequestAuthUserIdError from "../../../errors/controllers/missing-request-auth-user-id.error"
import UserNotFoundByIdError from "../../../errors/users/user-not-found-by-id.error"

export default class CreateTaskControllerImplementation implements CreateTaskController {
  private readonly taskValidator: TaskValidator
  private readonly userValidator: UserValidator
  private readonly createTaskUseCase: CreateTaskUseCase

  constructor(
    taskValidator: TaskValidator,
    userValidator: UserValidator,
    createTaskUseCase: CreateTaskUseCase
  ) {
    this.taskValidator = taskValidator
    this.userValidator = userValidator
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

  private getValidationMessageForAuthUserId(id: string | null): null | string {
    if (id === null) {
      return new MissingRequestAuthUserIdError("[CreateTaskController] execute").message
    }
    const idValidationMessage = this.userValidator.getMessageForId(id)
    if (idValidationMessage !== null) {
      return idValidationMessage
    }
    return null
  }

  public async execute(request: AdaptedRequest<CreateTaskBody>): Promise<ControllerResponse<void>> {
    const bodyValidationMessage = this.getValidationMessageForBody(request.body as CreateTaskBody)
    if (bodyValidationMessage !== null) {
      return { status: 400, body: bodyValidationMessage }
    }
    const authUserIdValidationMessage = this.getValidationMessageForAuthUserId(request.authUserId)
    if (authUserIdValidationMessage !== null) {
      return { status: 401, body: authUserIdValidationMessage }
    }
    try {
      // @ts-ignore - Refactoring makes TS loses the null safety
      await this.createTaskUseCase.execute(request.body, request.authUserId)
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
