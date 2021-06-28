import UserNotFoundByIdError from "../../../errors/users/user-not-found-by-id.error"
import GenerateAuthTokenService from "../../../services/auth/generate-auth-token-service.interface"
import FindUserByIdService from "../../../services/users/find-user-by-id-service.interface"
import { AuthenticationToken } from "../../../types/auth/token.types"
import { SignedUserDto } from "../../../types/user.types"

import GetSignedUserUseCase from "../get-signed-user-usecase.interface"

export default class GetSignedUserUseCaseImplementation implements GetSignedUserUseCase {
  private readonly findUserByIdService: FindUserByIdService
  private readonly generateAuthTokenService: GenerateAuthTokenService

  constructor(
    findUserByIdService: FindUserByIdService,
    generateAuthTokenService: GenerateAuthTokenService
  ) {
    this.findUserByIdService = findUserByIdService
    this.generateAuthTokenService = generateAuthTokenService
  }

  public async execute(decodedToken: AuthenticationToken): Promise<SignedUserDto> {
    const userFound = await this.findUserByIdService.execute(decodedToken.userId)
    if (userFound === null) {
      throw new UserNotFoundByIdError("[GetSignedUserUseCase] execute")
    }
    const newToken = this.generateAuthTokenService.execute(decodedToken.userId, decodedToken.exp)
    const { id, name, email } = userFound
    return {
      id,
      name,
      email,
      token: newToken
    }
  }
}
