import { CreateUserRequest } from "../../../types/controller/request.types"
import { CreateUserResponse } from "../../../types/controller/response.types"

import CreateUserController from "../create-user-controller.interface"

export default class CreateUserControllerImplementation implements CreateUserController {
  public constructor() {}

  public async execute(_request: CreateUserRequest): Promise<CreateUserResponse> {
    throw new Error("Method not implemented.")
  }
}
