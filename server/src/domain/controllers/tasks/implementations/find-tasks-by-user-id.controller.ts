import { AdaptedRequest } from "../../../../utils/types/controller/util.types"
import { FindTasksByUserIdResponse } from "../../../types/controller/response.types"

import FindTasksByUserIdController from "../find-tasks-by-user-id-controller.interface"

export default class FindTasksByUserIdControllerImplementation
  implements FindTasksByUserIdController
{
  public constructor() {}

  public async execute(_request: AdaptedRequest): Promise<FindTasksByUserIdResponse> {
    throw new Error("Method not implemented.")
  }
}
