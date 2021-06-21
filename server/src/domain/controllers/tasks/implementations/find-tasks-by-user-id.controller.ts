import { AdaptedRequest, ControllerResponse } from "../../../types/router.types"
import { TaskDto } from "../../../types/task.types"

import FindTasksByUserIdController from "../find-tasks-by-user-id-controller.interface"

export default class FindTasksByUserIdControllerImplementation
  implements FindTasksByUserIdController
{
  public async execute(_request: AdaptedRequest<null>): Promise<ControllerResponse<TaskDto[]>> {
    throw new Error("Method not implemented.")
  }
}
