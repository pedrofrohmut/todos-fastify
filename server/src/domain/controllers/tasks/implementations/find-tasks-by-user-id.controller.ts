import { AdaptedRequest, ControllerResponse, Params } from "../../../types/router.types"
import { TaskDto } from "../../../types/task.types"
import { AuthenticationToken } from "../../../types/auth/token.types"

import FindTasksByUserIdUseCase from "../../../usecases/tasks/find-tasks-by-user-id-usecase.interface"
import FindTasksByUserIdController from "../find-tasks-by-user-id-controller.interface"
import UserValidator from "../../../validators/user-validator.interface"

import MissingRequestParamsError from "../../../errors/controllers/missing-request-params.error"
import MissingRequestAuthTokenError from "../../../errors/controllers/missing-request-auth-token.error"
import UserIdFromParamsDontMatchTokenError from "../../../errors/controllers/user-id-from-params-dont-match-token.error"
import UserNotFoundByIdError from "../../../errors/users/user-not-found-by-id.error"

export default class FindTasksByUserIdControllerImplementation
  implements FindTasksByUserIdController
{
  private readonly errorMessage = "[FindTasksByUserIdController] execute"

  constructor(
    private readonly userValidator: UserValidator,
    private readonly findTasksByUserIdUseCase: FindTasksByUserIdUseCase
  ) {}

  private getValidationMessageForParams(params: Params | null): null | string {
    if (params === null) {
      return new MissingRequestParamsError(this.errorMessage).message
    }
    const userIdValidationMessage = this.userValidator.getMessageForId(params.userId)
    if (userIdValidationMessage !== null) {
      return userIdValidationMessage
    }
    return null
  }

  private getValidationMessageForAuthToken(
    authToken: AuthenticationToken | null,
    paramsUserId: string
  ): null | string {
    if (authToken === null) {
      return new MissingRequestAuthTokenError(this.errorMessage).message
    }
    if (paramsUserId !== authToken.userId) {
      return new UserIdFromParamsDontMatchTokenError(this.errorMessage).message
    }
    return null
  }

  public async execute(request: AdaptedRequest<null>): Promise<ControllerResponse<TaskDto[]>> {
    const paramsValidationMessage = this.getValidationMessageForParams(request.params)
    if (paramsValidationMessage !== null) {
      return { status: 400, body: paramsValidationMessage }
    }
    const paramUserId = request.params!.userId
    const authTokenValidationMessage = this.getValidationMessageForAuthToken(
      request.authToken,
      paramUserId!
    )
    if (authTokenValidationMessage !== null) {
      return { status: 401, body: authTokenValidationMessage }
    }
    try {
      const tasks = await this.findTasksByUserIdUseCase.execute(paramUserId!)
      return { status: 200, body: tasks }
    } catch (err) {
      if (err instanceof UserNotFoundByIdError) {
        return { status: 400, body: new UserNotFoundByIdError(this.errorMessage).message }
      }
      throw err
    }
  }
}
