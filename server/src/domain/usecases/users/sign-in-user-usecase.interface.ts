import { SignInUserBody } from "../../types/request/body.types"
import { SignedUserDto } from "../../types/user.types"

export default interface SignInUserUseCase {
  execute(credentials: SignInUserBody): Promise<SignedUserDto>
}
