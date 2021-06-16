import { SignInUserBody } from "../../types/request/body.types"
import { AdaptedRequest, ControllerResponse } from "../../types/router.types"
import { SignedUser } from "../../types/user.types"

export default interface SignInUserController {
  execute(request: AdaptedRequest<SignInUserBody>): Promise<ControllerResponse<SignedUser>>
}
