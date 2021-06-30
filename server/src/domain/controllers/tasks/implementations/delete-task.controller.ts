import { AdaptedRequest, ControllerResponse, Params } from "../../../types/router.types"

import DeleteTaskUseCase from "../../../usecases/tasks/delete-task-usecase.interface"
import TaskValidator from "../../../validators/task-validator.interface"
import DeleteTaskController from "../delete-task-controller.interface"

import MissingRequestParamsError from "../../../errors/controllers/missing-request-params.error"
import UserNotFoundByIdError from "../../../errors/users/user-not-found-by-id.error"
import MissingRequestAuthTokenError from "../../../errors/controllers/missing-request-auth-token.error"
import TaskNotFoundByIdError from "../../../errors/tasks/task-not-found-by-id.error"

export default class DeleteTaskControllerImplementation implements DeleteTaskController {
  private readonly errorMessage = "[DeleteTaskController] execute"

  constructor(
    private readonly taskValidator: TaskValidator,
    private readonly deleteTaskUseCase: DeleteTaskUseCase
  ) {}

  private getValidationMessageForParams(params: Params): null | string {
    if (params === null) {
      return new MissingRequestParamsError(this.errorMessage).message
    }
    const taskIdValidationMessage = this.taskValidator.getMessageForId(params.taskId)
    if (taskIdValidationMessage !== null) {
      return taskIdValidationMessage
    }
    return null
  }

  public async execute(request: AdaptedRequest<null>): Promise<ControllerResponse<undefined>> {
    const paramsValidationMessage = this.getValidationMessageForParams(request.params)
    if (paramsValidationMessage !== null) {
      return { status: 400, body: paramsValidationMessage }
    }
    if (request.authToken === null) {
      return { status: 401, body: new MissingRequestAuthTokenError(this.errorMessage).message }
    }
    try {
      const userId = request.authToken.userId
      const taskId = request.params!.taskId
      await this.deleteTaskUseCase.execute(userId, taskId!)
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
