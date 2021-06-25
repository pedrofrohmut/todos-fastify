import { AuthenticationToken } from "../../types/auth/token.types"
import { SignedUserDto } from "../../types/user.types"

export default interface GetSignedUserUseCase {
  execute(decodedToken: AuthenticationToken): Promise<SignedUserDto>
}
