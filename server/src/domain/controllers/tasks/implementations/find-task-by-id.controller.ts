import { AdaptedRequest, ControllerResponse } from "../../../types/router.types"
import { TaskDto } from "../../../types/task.types"

import FindTaskByIdController from "../find-task-by-id-controller.interface"

export default class FindTaskByIdControllerImplementation implements FindTaskByIdController {
  public async execute(_request: AdaptedRequest<null>): Promise<ControllerResponse<TaskDto>> {
    throw new Error("Method not implemented.")
  }
}
