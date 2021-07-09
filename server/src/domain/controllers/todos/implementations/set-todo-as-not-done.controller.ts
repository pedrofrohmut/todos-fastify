import MissingRequestAuthTokenError from "../../../errors/controllers/missing-request-auth-token.error"
import MissingRequestParamsError from "../../../errors/controllers/missing-request-params.error"
import TodoNotFoundByIdError from "../../../errors/todos/todo-not-found-by-id.error"
import UserNotFoundByIdError from "../../../errors/users/user-not-found-by-id.error"
import { AuthenticationToken } from "../../../types/auth/token.types"
import { AdaptedRequest, ControllerResponse, Params } from "../../../types/router.types"
import SetTodoAsNotDoneUseCase from "../../../usecases/todos/set-todo-as-not-done-usecase.interface"
import TodoValidator from "../../../validators/todo-validator.interface"
import SetTodoAsNotDoneController from "../set-todo-as-not-done-controller.interface"

export default class SetTodoAsNotDoneControllerImplementation
  implements SetTodoAsNotDoneController
{
  private readonly errorMessage = "[SetTodoAsNotDoneController] execute"

  constructor(
    private readonly todoValidator: TodoValidator,
    private readonly setTodoAsNotDoneUseCase: SetTodoAsNotDoneUseCase
  ) {}

  private getValidationMessageForParams(params: Params | null): null | string {
    if (params === null) {
      return new MissingRequestParamsError(this.errorMessage).message
    }
    const todoIdValidationMessage = this.todoValidator.getMessageForId(params.todoId)
    if (todoIdValidationMessage !== null) {
      return todoIdValidationMessage
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
    const paramsValidationMessage = this.getValidationMessageForParams(request.params)
    if (paramsValidationMessage !== null) {
      return { status: 400, body: paramsValidationMessage }
    }
    const authTokenValidationMessage = this.getValidationMessageForAuthToken(request.authToken)
    if (authTokenValidationMessage !== null) {
      return { status: 401, body: authTokenValidationMessage }
    }
    try {
      const userId = request.authToken!.userId
      const todoId = request.params!.todoId!
      await this.setTodoAsNotDoneUseCase.execute(userId, todoId)
      return { status: 204 }
    } catch (err) {
      if (err instanceof UserNotFoundByIdError) {
        return { status: 400, body: new UserNotFoundByIdError(this.errorMessage).message }
      }
      if (err instanceof TodoNotFoundByIdError) {
        return { status: 400, body: new TodoNotFoundByIdError(this.errorMessage).message }
      }
      throw err
    }
  }
}
