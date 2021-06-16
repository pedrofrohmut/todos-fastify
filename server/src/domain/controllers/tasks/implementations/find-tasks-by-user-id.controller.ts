import { AdaptedRequest, ControllerResponse } from "../../../types/router.types"
import { Task } from "../../../types/task.types"

import FindTasksByUserIdController from "../find-tasks-by-user-id-controller.interface"

export default class FindTasksByUserIdControllerImplementation
  implements FindTasksByUserIdController
{
  public async execute(_request: AdaptedRequest<null>): Promise<ControllerResponse<Task[]>> {
    throw new Error("Method not implemented.")
  }
}
