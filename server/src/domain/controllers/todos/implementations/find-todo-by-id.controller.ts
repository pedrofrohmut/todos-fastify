import { AdaptedRequest, ControllerResponse, Params } from "../../../types/router.types"
import { TodoDto } from "../../../types/todo.types"
import { AuthenticationToken } from "../../../types/auth/token.types"

import TodoValidator from "../../../validators/todo-validator.interface"
import FindTodoByIdUseCase from "../../../usecases/todos/find-todo-by-id-usecase.interface"
import FindTodoByIdController from "../find-todo-by-id-controller.interface"

import MissingRequestParamsError from "../../../errors/controllers/missing-request-params.error"
import MissingRequestAuthTokenError from "../../../errors/controllers/missing-request-auth-token.error"
import UserNotFoundByIdError from "../../../errors/users/user-not-found-by-id.error"
import TodoNotFoundByIdError from "../../../errors/todos/todo-not-found-by-id.error"

export default class FindTodoByIdControllerImplementation implements FindTodoByIdController {
  private readonly errorMessage = "[FindTodoByIdController] execute"

  constructor(
    private readonly todoValidator: TodoValidator,
    private readonly findTodoByIdUseCase: FindTodoByIdUseCase
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

  public async execute(request: AdaptedRequest<null>): Promise<ControllerResponse<TodoDto>> {
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
      const foundTodo = await this.findTodoByIdUseCase.execute(userId, todoId)
      return { status: 200, body: foundTodo || undefined }
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
