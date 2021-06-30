import { SignInUserBody } from "../../../types/request/body.types"
import { AdaptedRequest, ControllerResponse } from "../../../types/router.types"
import { SignedUserDto } from "../../../types/user.types"

import SignInUserUseCase from "../../../usecases/users/sign-in-user-usecase.interface"
import UserValidator from "../../../validators/user-validator.interface"
import SignInUserController from "../sign-in-user-controller.interface"

import MissingRequestBodyError from "../../../errors/controllers/missing-request-body.error"
import UserNotFoundByEmailError from "../../../errors/users/user-not-found-by-email.error"
import PasswordAndHashDontMatchError from "../../../errors/auth/password-and-hash-dont-match.error"

export default class SignInUserControllerImplementation implements SignInUserController {
  private errorMessage = "[SignInUserController] execute"

  constructor(
    private readonly userValidator: UserValidator,
    private readonly signInUserUseCase: SignInUserUseCase
  ) {}

  private getValidationMessageForBody(body: SignInUserBody | null): null | string {
    if (body === null) {
      return new MissingRequestBodyError(this.errorMessage).message
    }
    const emailValidationMessage = this.userValidator.getMessageForEmail(body.email)
    if (emailValidationMessage !== null) {
      return emailValidationMessage
    }
    const passwordValidationMessage = this.userValidator.getMessageForPassword(body.password)
    if (passwordValidationMessage !== null) {
      return passwordValidationMessage
    }
    return null
  }

  public async execute(
    request: AdaptedRequest<SignInUserBody>
  ): Promise<ControllerResponse<SignedUserDto>> {
    const bodyValidationMessage = this.getValidationMessageForBody(request.body)
    if (bodyValidationMessage !== null) {
      return { status: 400, body: bodyValidationMessage }
    }
    try {
      const signedUser = await this.signInUserUseCase.execute(request.body)
      return { status: 200, body: signedUser }
    } catch (err) {
      if (err instanceof UserNotFoundByEmailError) {
        return { status: 400, body: new UserNotFoundByEmailError(this.errorMessage).message }
      }
      if (err instanceof PasswordAndHashDontMatchError) {
        return { status: 400, body: new PasswordAndHashDontMatchError(this.errorMessage).message }
      }
      throw err
    }
  }
}
