import { CreateTaskBody } from "../../../types/request/body.types"
import { AdaptedRequest, ControllerResponse } from "../../../types/router.types"
import { AuthenticationToken } from "../../../types/auth/token.types"

import CreateTaskController from "../create-task-controller.interface"
import TaskValidator from "../../../validators/task-validator.interface"
import UserValidator from "../../../validators/user-validator.interface"
import CreateTaskUseCase from "../../../usecases/tasks/create-task-usecase.interface"

import MissingRequestBodyError from "../../../errors/controllers/missing-request-body.error"
import UserNotFoundByIdError from "../../../errors/users/user-not-found-by-id.error"
import MissingRequestAuthTokenError from "../../../errors/controllers/missing-request-auth-token.error"

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

  private getValidationMessageForAuthToken(authToken: AuthenticationToken | null): string | null {
    if (authToken === null) {
      return new MissingRequestAuthTokenError("[CreateTaskController] execute").message
    }
    const userIdValidationMessage = this.userValidator.getMessageForId(authToken.userId)
    if (userIdValidationMessage !== null) {
      return userIdValidationMessage
    }
    return null
  }

  public async execute(request: AdaptedRequest<CreateTaskBody>): Promise<ControllerResponse<void>> {
    const bodyValidationMessage = this.getValidationMessageForBody(request.body as CreateTaskBody)
    if (bodyValidationMessage !== null) {
      return { status: 400, body: bodyValidationMessage }
    }
    const authTokenValidationMessage = this.getValidationMessageForAuthToken(request.authToken)
    if (authTokenValidationMessage !== null) {
      return { status: 401, body: authTokenValidationMessage }
    }
    try {
      const newTask = request.body
      const userId = request.authToken!.userId
      await this.createTaskUseCase.execute(newTask, userId)
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
