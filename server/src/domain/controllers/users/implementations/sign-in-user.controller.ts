import { SignInUserBody } from "../../../types/request/body.types"
import { AdaptedRequest, ControllerResponse } from "../../../types/router.types"
import { SignedUser } from "../../../types/user.types"

import SignInUserController from "../sign-in-user-controller.interface"

export default class SignInUserControllerImplementation implements SignInUserController {
  public async execute(
    _request: AdaptedRequest<SignInUserBody>
  ): Promise<ControllerResponse<SignedUser>> {
    throw new Error("Method not implemented.")
  }
}
