import { AdaptedRequest, ControllerResponse } from "../../../types/router.types"
import { SignedUser } from "../../../types/user.types"

import GetSignedUserController from "../get-signed-user-controller.interface"

export default class GetSignedUserControllerImplementation implements GetSignedUserController {
  public async execute(_request: AdaptedRequest<null>): Promise<ControllerResponse<SignedUser>> {
    throw new Error("Method not implemented.")
  }
}
