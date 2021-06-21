import { CreateUserBody } from "../../../types/request/body.types"
import { AdaptedRequest, ControllerResponse } from "../../../types/router.types"

import CreateUserController from "../create-user-controller.interface"
import CreateUserUseCase from "../../../usecases/users/create-user-usecase.interface"

import MissingRequestBodyError from "../../../errors/controllers/missing-request-body.error"
import UserValidator from "../../../validators/user-validator.interface"
import EmailAlreadyRegisteredError from "../../../errors/users/email-already-registered.error"

export default class CreateUserControllerImplementation implements CreateUserController {
  private readonly userValidator: UserValidator
  private readonly createUserUseCase: CreateUserUseCase

  constructor(userValidator: UserValidator, createUserUseCase: CreateUserUseCase) {
    this.userValidator = userValidator
    this.createUserUseCase = createUserUseCase
  }

  private getValidationMessageForBody(body: CreateUserBody | null): string | null {
    if (body === null) {
      return new MissingRequestBodyError().message
    }
    const nameValidationMessage = this.userValidator.getMessageForName(body.name)
    if (nameValidationMessage !== null) {
      return nameValidationMessage
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
    request: AdaptedRequest<CreateUserBody>
  ): Promise<ControllerResponse<undefined>> {
    const bodyValidationMessage = this.getValidationMessageForBody(request.body)
    if (bodyValidationMessage !== null) {
      return { status: 400, body: bodyValidationMessage }
    }
    try {
      await this.createUserUseCase.execute(request.body)
      return { status: 201 }
    } catch (err) {
      if (err instanceof EmailAlreadyRegisteredError) {
        return {
          status: 400,
          body: new EmailAlreadyRegisteredError("[CreateUserController] execute").message
        }
      }
      throw err
    }
  }
}
