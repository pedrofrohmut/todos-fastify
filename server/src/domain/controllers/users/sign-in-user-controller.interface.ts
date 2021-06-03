import { SignInUserRequest } from "../../types/controller/request.types"
import { SignInUserResponse } from "../../types/controller/response.types"

export default interface SignInUserController {
  execute(request: SignInUserRequest): Promise<SignInUserResponse>
}
