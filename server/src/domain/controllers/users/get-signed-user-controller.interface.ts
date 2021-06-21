import { AdaptedRequest, ControllerResponse } from "../../types/router.types"
import { SignedUserDto } from "../../types/user.types"

export default interface GetSignedUserController {
  execute(request: AdaptedRequest<null>): Promise<ControllerResponse<SignedUserDto>>
}
