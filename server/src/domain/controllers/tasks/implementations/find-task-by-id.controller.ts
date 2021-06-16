import { AdaptedRequest, ControllerResponse } from "../../../types/router.types"
import { Task } from "../../../types/task.types"

import FindTaskByIdController from "../find-task-by-id-controller.interface"

export default class FindTaskByIdControllerImplementation implements FindTaskByIdController {
  public async execute(_request: AdaptedRequest<null>): Promise<ControllerResponse<Task>> {
    throw new Error("Method not implemented.")
  }
}
