import { AdaptedRequest, ControllerResponse, Params } from "../../../types/router.types"
import { TaskDto } from "../../../types/task.types"

import TaskValidator from "../../../validators/task-validator.interface"
import FindTaskByIdUseCase from "../../../usecases/tasks/find-task-by-id-usecase.interface"
import FindTaskByIdController from "../find-task-by-id-controller.interface"
import MissingRequestParamsError from "../../../errors/controllers/missing-request-params.error"
import MissingRequestAuthTokenError from "../../../errors/controllers/missing-request-auth-token.error"
import UserNotFoundByIdError from "../../../errors/users/user-not-found-by-id.error"
import TaskNotFoundByIdError from "../../../errors/tasks/task-not-found-by-id.error"

export default class FindTaskByIdControllerImplementation implements FindTaskByIdController {
  private readonly errorMessage = "[FindTaskByIdController] execute"

  constructor(
    private readonly taskValidator: TaskValidator,
    private readonly findTaskByIdUseCase: FindTaskByIdUseCase
  ) {}

  private getValidationMessageForParams(params: null | Params): null | string {
    if (params === null) {
      return new MissingRequestParamsError(this.errorMessage).message
    }
    const taskIdValidationMessage = this.taskValidator.getMessageForId(params.taskId)
    if (taskIdValidationMessage !== null) {
      return taskIdValidationMessage
    }
    return null
  }

  public async execute(request: AdaptedRequest<null>): Promise<ControllerResponse<TaskDto>> {
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
      const foundTask = await this.findTaskByIdUseCase.execute(userId, taskId!)
      return { status: 200, body: foundTask }
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
