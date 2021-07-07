import { AdaptedRequest, ControllerResponse, Params } from "../../../types/router.types"
import { TodoDto } from "../../../types/todo.types"
import { AuthenticationToken } from "../../../types/auth/token.types"

import FindTodosByTaskIdController from "../find-todos-by-task-id-controller.interface"
import TaskValidator from "../../../validators/task-validator.interface"
import FindTodosByTaskIdUseCase from "../../../usecases/todos/find-todos-by-task-id-usecase.interface"

import MissingRequestParamsError from "../../../errors/controllers/missing-request-params.error"
import MissingRequestAuthTokenError from "../../../errors/controllers/missing-request-auth-token.error"
import UserNotFoundByIdError from "../../../errors/users/user-not-found-by-id.error"
import TaskNotFoundByIdError from "../../../errors/tasks/task-not-found-by-id.error"

export default class FindTodosByTaskIdControllerImplementation
  implements FindTodosByTaskIdController
{
  private readonly errorMessage = "[FindTodosByTaskIdController] execute"

  constructor(
    private readonly taskValidator: TaskValidator,
    private readonly findTodosByTaskIdUseCase: FindTodosByTaskIdUseCase
  ) {}

  public async execute(request: AdaptedRequest<null>): Promise<ControllerResponse<TodoDto[]>> {
    const paramsValidationMessage = this.getValidationMessageForParams(request.params)
    if (paramsValidationMessage !== null) {
      return { status: 400, body: paramsValidationMessage }
    }
    const authTokenValidationMessage = this.getAuthTokenValidationMessage(request.authToken)
    if (authTokenValidationMessage !== null) {
      return { status: 401, body: authTokenValidationMessage }
    }
    try {
      const userId = request.authToken!.userId
      const taskId = request.params!.taskId
      const foundTodos = await this.findTodosByTaskIdUseCase.execute(userId, taskId!)
      return { status: 200, body: foundTodos }
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

  private getAuthTokenValidationMessage(authToken: AuthenticationToken | null): null | string {
    if (authToken === null) {
      return new MissingRequestAuthTokenError(this.errorMessage).message
    }
    return null
  }
}
