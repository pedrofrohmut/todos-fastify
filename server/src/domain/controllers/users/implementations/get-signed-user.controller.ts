import { AdaptedRequest } from "../../../../utils/types/controller/util.types"
import { GetSignedUserResponse } from "../../../types/controller/response.types"

import GetSignedUserController from "../get-signed-user-controller.interface"

export default class GetSignedUserControllerImplementation implements GetSignedUserController {
  public constructor() {}

  public async execute(_request: AdaptedRequest): Promise<GetSignedUserResponse> {
    throw new Error("Method not implemented.")
  }
}
