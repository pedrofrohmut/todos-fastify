import { AdaptedRequest, ControllerResponse } from "../../types/router.types"
import { SignedUser } from "../../types/user.types"

export default interface GetSignedUserController {
  execute(request: AdaptedRequest<null>): Promise<ControllerResponse<SignedUser>>
}
