import MissingRequestAuthTokenError from "../../../errors/controllers/missing-request-auth-token.error"
import MissingRequestParamsError from "../../../errors/controllers/missing-request-params.error"
import TaskNotFoundByIdError from "../../../errors/tasks/task-not-found-by-id.error"
import UserNotFoundByIdError from "../../../errors/users/user-not-found-by-id.error"
import {AuthenticationToken} from "../../../types/auth/token.types"
import { AdaptedRequest, ControllerResponse, Params } from "../../../types/router.types"
import ClearCompleteTodosByTaskIdUseCase from "../../../usecases/todos/clear-complete-todos-by-task-id-usecase.interface"
import TaskValidator from "../../../validators/task-validator.interface"
import ClearCompleteTodosByTaskIdController from "../clear-complete-todos-by-task-id-controller.interface"

export default class ClearCompleteTodoByTaskIdControllerImplementation
  implements ClearCompleteTodosByTaskIdController
{
  private readonly errorMessage = "[ClearCompleteTodosByTaskIdController] execute"

  constructor(
    private readonly taskValidator: TaskValidator,
    private readonly clearCompleteTodosByTaskIdUseCase: ClearCompleteTodosByTaskIdUseCase
  ) {}

  private getValidationMessageForParams(params: Params | null): null | string {
    if (params === null) {
      return new MissingRequestParamsError(this.errorMessage).message
    }
    const taskIdValidationMessage = this.taskValidator.getMessageForId(params.taskId)
    if (taskIdValidationMessage !== null) {
      return taskIdValidationMessage
    }
    return null
  }

  private getValidationMessageForAuthToken(authToken: AuthenticationToken | null): null | string {
    if (authToken === null) {
      return new MissingRequestAuthTokenError(this.errorMessage).message
    }
    return null
  }

  public async execute(request: AdaptedRequest<null>): Promise<ControllerResponse<undefined>> {
    const paramsValidationMessge = this.getValidationMessageForParams(request.params)
    if (paramsValidationMessge !== null) {
      return { status: 400, body: paramsValidationMessge }
    }
    const authTokenValidationMessage = this.getValidationMessageForAuthToken(request.authToken)
    if (authTokenValidationMessage !== null) {
      return { status: 401, body: authTokenValidationMessage }
    }
    try {
      const userId = request.authToken!.userId
      const taskId = request.params!.taskId!
      await this.clearCompleteTodosByTaskIdUseCase.execute(userId, taskId)
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
