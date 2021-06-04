import { FindTaskByIdRequest } from "../../../types/controller/request.types"
import { FindTaskByIdResponse } from "../../../types/controller/response.types"

import FindTaskByIdController from "../find-task-by-id-controller.interface"

export default class FindTaskByIdControllerImplementation implements FindTaskByIdController {
  public constructor() {}

  public async execute(_request: FindTaskByIdRequest): Promise<FindTaskByIdResponse> {
    throw new Error("Method not implemented.")
  }
}
