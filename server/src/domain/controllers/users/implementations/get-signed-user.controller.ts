import { AdaptedRequest, ControllerResponse } from "../../../types/router.types"
import { SignedUserDto } from "../../../types/user.types"

import GetSignedUserController from "../get-signed-user-controller.interface"

export default class GetSignedUserControllerImplementation implements GetSignedUserController {
  public async execute(_request: AdaptedRequest<null>): Promise<ControllerResponse<SignedUserDto>> {
    throw new Error("Method not implemented.")
  }
}
