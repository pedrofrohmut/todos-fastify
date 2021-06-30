import { SignInUserBody } from "../../../types/request/body.types"
import { SignedUserDto } from "../../../types/user.types"

import SignInUserUseCase from "../sign-in-user-usecase.interface"
import FindUserByEmailService from "../../../services/users/find-user-by-email-service.interface"
import ComparePasswordAndHashService from "../../../services/auth/compare-password-and-hash-service.interface"
import GenerateAuthTokenService from "../../../services/auth/generate-auth-token-service.interface"

import UserNotFoundByEmailError from "../../../errors/users/user-not-found-by-email.error"
import PasswordAndHashDontMatchError from "../../../errors/auth/password-and-hash-dont-match.error"

export default class SignInUserUseCaseImplementation implements SignInUserUseCase {
  private readonly errorMessage = "[SignInUserUseCase] execute"

  constructor(
    private readonly findUserByEmailService: FindUserByEmailService,
    private readonly comparePasswordAndHashService: ComparePasswordAndHashService,
    private readonly generateAuthTokenService: GenerateAuthTokenService
  ) {}

  public async execute(credentials: SignInUserBody): Promise<SignedUserDto> {
    const foundUser = await this.findUserByEmailService.execute(credentials.email)
    if (foundUser === null) {
      throw new UserNotFoundByEmailError()
    }
    const isMatch = await this.comparePasswordAndHashService.execute(
      credentials.password,
      foundUser.passwordHash
    )
    if (!isMatch) {
      throw new PasswordAndHashDontMatchError(this.errorMessage)
    }
    const token = this.generateAuthTokenService.execute(foundUser.id)
    const { id, name, email } = foundUser
    return {
      id,
      name,
      email,
      token
    }
  }
}
