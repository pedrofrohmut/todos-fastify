import { AdaptedRequest, ControllerResponse } from "../../../types/router.types"
import { SignedUserDto } from "../../../types/user.types"

import GetSignedUserController from "../get-signed-user-controller.interface"
import GetSignedUserUseCase from "../../../usecases/users/get-signed-user-usecase.interface"

import MissingRequestAuthTokenError from "../../../errors/controllers/missing-request-auth-token.error"
import UserNotFoundByIdError from "../../../errors/users/user-not-found-by-id.error"

export default class GetSignedUserControllerImplementation implements GetSignedUserController {
  private readonly errorMessage = "[GetSignedUserController] execute"

  constructor(private readonly getSignedUserUseCase: GetSignedUserUseCase) {}

  public async execute(request: AdaptedRequest<null>): Promise<ControllerResponse<SignedUserDto>> {
    if (request.authToken === null) {
      return {
        status: 401,
        body: new MissingRequestAuthTokenError(this.errorMessage).message
      }
    }
    try {
      const signedUser = await this.getSignedUserUseCase.execute(request.authToken)
      return { status: 200, body: signedUser }
    } catch (err) {
      if (err instanceof UserNotFoundByIdError) {
        return {
          status: 400,
          body: new UserNotFoundByIdError(this.errorMessage).message
        }
      }
      throw err
    }
  }
}
