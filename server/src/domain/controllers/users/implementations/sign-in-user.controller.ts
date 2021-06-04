import { SignInUserRequest } from "../../../types/controller/request.types"
import { SignInUserResponse } from "../../../types/controller/response.types"

import SignInUserController from "../sign-in-user-controller.interface"

export default class SignInUserControllerImplementation implements SignInUserController {
  public constructor() {}

  public async execute(_request: SignInUserRequest): Promise<SignInUserResponse> {
    throw new Error("Method not implemented.")
  }
}
