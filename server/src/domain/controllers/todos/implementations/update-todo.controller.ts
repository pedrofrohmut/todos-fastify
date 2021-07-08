import MissingRequestAuthTokenError from "../../../errors/controllers/missing-request-auth-token.error"
import MissingRequestBodyError from "../../../errors/controllers/missing-request-body.error"
import MissingRequestParamsError from "../../../errors/controllers/missing-request-params.error"
import TodoNotFoundByIdError from "../../../errors/todos/todo-not-found-by-id.error"
import UserNotFoundByIdError from "../../../errors/users/user-not-found-by-id.error"
import { AuthenticationToken } from "../../../types/auth/token.types"
import { UpdateTodoBody } from "../../../types/request/body.types"
import { AdaptedRequest, ControllerResponse, Params } from "../../../types/router.types"
import UpdateTodoUseCase from "../../../usecases/todos/update-todo-usecase.interface"
import TodoValidator from "../../../validators/todo-validator.interface"

import UpdateTodoController from "../update-todo-controller.interface"

export default class UpdateTodoControllerImplementation implements UpdateTodoController {
  private readonly errorMessage = "[UpdateTodoController] execute"

  constructor(
    private readonly todoValidator: TodoValidator,
    private readonly updateTodoUseCase: UpdateTodoUseCase
  ) {}

  private getValidationMessageForBody(body: UpdateTodoBody | null): null | string {
    if (body === null) {
      return new MissingRequestBodyError(this.errorMessage).message
    }
    const nameValidationMessage = this.todoValidator.getMessageForName(body.name)
    if (nameValidationMessage !== null) {
      return nameValidationMessage
    }
    const descriptionValidationMessage = this.todoValidator.getMessageForDescription(
      body.description
    )
    if (descriptionValidationMessage !== null) {
      return descriptionValidationMessage
    }
    const isDoneValidationMessage = this.todoValidator.getMessageForIsDone(body.isDone)
    if (isDoneValidationMessage !== null) {
      return isDoneValidationMessage
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
    const todoIdValidationMessage = this.todoValidator.getMessageForId(params.todoId)
    if (todoIdValidationMessage !== null) {
      return todoIdValidationMessage
    }
    return null
  }

  public async execute(
    request: AdaptedRequest<UpdateTodoBody>
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
      const userId = request.authToken!.userId
      const todoId = request.params!.todoId!
      const updatedBody = request.body
      await this.updateTodoUseCase.execute(userId, todoId, updatedBody)
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
