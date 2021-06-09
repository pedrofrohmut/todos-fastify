import { AdaptedRequest } from "../../../../utils/types/controller/util.types"
import { CreateUserResponse } from "../../../types/controller/response.types"

import CreateUserController from "../create-user-controller.interface"

export default class CreateUserControllerImplementation implements CreateUserController {
  public constructor() {}

  public async execute(_request: AdaptedRequest): Promise<CreateUserResponse> {
    throw new Error("Method not implemented.")
  }
}
