import { CreateUserBody } from "../../../types/request/body.types"
import { AdaptedRequest, ControllerResponse } from "../../../types/router.types"

import CreateUserController from "../create-user-controller.interface"

export default class CreateUserControllerImplementation implements CreateUserController {
  public async execute(
    _request: AdaptedRequest<CreateUserBody>
  ): Promise<ControllerResponse<undefined>> {
    throw new Error("Method not implemented.")
  }
}
