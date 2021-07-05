import MissingRequestAuthTokenError from "../../../errors/controllers/missing-request-auth-token.error"
import MissingRequestBodyError from "../../../errors/controllers/missing-request-body.error"
import TaskNotFoundByIdError from "../../../errors/tasks/task-not-found-by-id.error"
import UserNotFoundByIdError from "../../../errors/users/user-not-found-by-id.error"
import { AuthenticationToken } from "../../../types/auth/token.types"
import { CreateTodoBody } from "../../../types/request/body.types"
import { AdaptedRequest, ControllerResponse } from "../../../types/router.types"
import { CreateTodoDto } from "../../../types/todo.types"
import CreateTodoUseCase from "../../../usecases/todos/create-todo-usecase.interface"
import TaskValidator from "../../../validators/task-validator.interface"
import TodoValidator from "../../../validators/todo-validator.interface"

import CreateTodoController from "../create-todo-controller.interface"

export default class CreateTodoControllerImplementation implements CreateTodoController {
  private readonly errorMessage = "[CreateTodoController] execute"

  constructor(
    private readonly todoValidator: TodoValidator,
    private readonly taskValidator: TaskValidator,
    private readonly createTodoUseCase: CreateTodoUseCase
  ) {}

  private getValidationMessageForBody(body: CreateTodoBody | null): null | string {
    if (body === null) {
      return new MissingRequestBodyError(this.errorMessage).message
    }
    const nameValidationMessge = this.todoValidator.getMessageForName(body.name)
    if (nameValidationMessge !== null) {
      return nameValidationMessge
    }
    const descriptionValidationMessage = this.todoValidator.getMessageForDescription(
      body.description
    )
    if (descriptionValidationMessage !== null) {
      return descriptionValidationMessage
    }
    const taskIdValidationMessage = this.taskValidator.getMessageForId(body.taskId)
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

  public async execute(
    request: AdaptedRequest<CreateTodoBody>
  ): Promise<ControllerResponse<undefined>> {
    const bodyValidationMessage = this.getValidationMessageForBody(request.body)
    if (bodyValidationMessage !== null) {
      return { status: 400, body: bodyValidationMessage }
    }
    const authTokenValidationMessage = this.getValidationMessageForAuthToken(request.authToken)
    if (authTokenValidationMessage !== null) {
      return { status: 401, body: authTokenValidationMessage }
    }
    try {
      const userId = request.authToken!.userId
      const newTodo: CreateTodoDto = {
        ...request.body,
        userId
      }
      await this.createTodoUseCase.execute(newTodo)
      return { status: 201 }
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
