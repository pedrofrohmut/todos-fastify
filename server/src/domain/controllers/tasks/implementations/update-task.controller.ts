import { AuthenticationToken } from "../../../types/auth/token.types"
import { UpdateTaskBody } from "../../../types/request/body.types"
import { AdaptedRequest, ControllerResponse, Params } from "../../../types/router.types"

import UpdateTaskUseCase from "../../../usecases/tasks/update-task-usecase.interface"
import TaskValidator from "../../../validators/task-validator.interface"
import UpdateTaskController from "../update-task-controller.interface"

import MissingRequestAuthTokenError from "../../../errors/controllers/missing-request-auth-token.error"
import MissingRequestBodyError from "../../../errors/controllers/missing-request-body.error"
import MissingRequestParamsError from "../../../errors/controllers/missing-request-params.error"
import TaskNotFoundByIdError from "../../../errors/tasks/task-not-found-by-id.error"
import UserNotFoundByIdError from "../../../errors/users/user-not-found-by-id.error"

export default class UpdateTaskControllerImplementation implements UpdateTaskController {
  private readonly errorMessage = "[UpdateTaskController] execute"

  constructor(
    private readonly taskValidator: TaskValidator,
    private readonly updateTaskUseCase: UpdateTaskUseCase
  ) {}

  private getValidationMessageForBody(body: UpdateTaskBody | null): null | string {
    if (body === null) {
      return new MissingRequestBodyError(this.errorMessage).message
    }
    const nameValidationMessage = this.taskValidator.getMessageForName(body.name)
    if (nameValidationMessage !== null) {
      return nameValidationMessage
    }
    const descriptionValidationMessage = this.taskValidator.getMessageForDescription(
      body.description
    )
    if (descriptionValidationMessage !== null) {
      return descriptionValidationMessage
    }
    return null
  }

  private getValidationMessageForAuthToken(authToken: AuthenticationToken | null): null | string {
    if (authToken === null) {
      return new MissingRequestAuthTokenError(this.errorMessage).message
    }
    return null
  }

  private getValidationMessageForParams(params: Params | null): null | string {
    if (params === null) {
      return new MissingRequestParamsError(this.errorMessage).message
    }
    const taskIdValidationdMessage = this.taskValidator.getMessageForId(params.taskId)
    if (taskIdValidationdMessage !== null) {
      return taskIdValidationdMessage
    }
    return null
  }

  public async execute(
    request: AdaptedRequest<UpdateTaskBody>
  ): Promise<ControllerResponse<undefined>> {
    const bodyValidationMessage = this.getValidationMessageForBody(request.body)
    if (bodyValidationMessage !== null) {
      return { status: 400, body: bodyValidationMessage }
    }
    const authTokenValidationMessage = this.getValidationMessageForAuthToken(request.authToken)
    if (authTokenValidationMessage !== null) {
      return { status: 401, body: authTokenValidationMessage }
    }
    const paramsValidationMessage = this.getValidationMessageForParams(request.params)
    if (paramsValidationMessage !== null) {
      return { status: 400, body: paramsValidationMessage }
    }
    try {
      const updatedTask = {
        id: request.params!.taskId!,
        name: request.body.name,
        description: request.body.description || "",
        userId: request.authToken!.userId
      }
      await this.updateTaskUseCase.execute(updatedTask)
      return { status: 204 }
    } catch (err) {
      if (err instanceof UserNotFoundByIdError) {
        return { status: 400, body: new UserNotFoundByIdError(this.errorMessage).message }
      }
      if (err instanceof TaskNotFoundByIdError) {
        return { status: 400, body: new TaskNotFoundByIdError(this.errorMessage).message }
      }
      throw err
    }
  }
}
