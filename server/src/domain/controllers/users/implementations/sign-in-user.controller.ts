import { AdaptedRequest } from "../../../../utils/types/controller/util.types"
import { SignInUserResponse } from "../../../types/controller/response.types"

import SignInUserController from "../sign-in-user-controller.interface"

export default class SignInUserControllerImplementation implements SignInUserController {
  public constructor() {}

  public async execute(_request: AdaptedRequest): Promise<SignInUserResponse> {
    throw new Error("Method not implemented.")
  }
}
