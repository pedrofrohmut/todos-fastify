import { CreateTaskResponse } from "../../../types/controller/response.types"
import { AdaptedRequest } from "../../../types/router.types"

import CreateTaskController from "../create-task-controller.interface"

export default class CreateTaskControllerImplementation implements CreateTaskController {
  public execute(request: AdaptedRequest): Promise<CreateTaskResponse> {
    throw new Error("Method not implemented.")
  }
}
