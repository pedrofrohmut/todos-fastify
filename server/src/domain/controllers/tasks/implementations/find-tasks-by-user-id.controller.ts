import { FindTasksByUserIdRequest } from "../../../types/controller/request.types"
import { FindTasksByUserIdResponse } from "../../../types/controller/response.types"

import FindTasksByUserIdController from "../find-task-by-user-id-controller.interface"

export default class FindTasksByUserIdControllerImplementation
  implements FindTasksByUserIdController
{
  public constructor() {}

  public async execute(_request: FindTasksByUserIdRequest): Promise<FindTasksByUserIdResponse> {
    throw new Error("Method not implemented.")
  }
}
