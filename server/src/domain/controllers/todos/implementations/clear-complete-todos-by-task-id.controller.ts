import { AdaptedRequest, ControllerResponse } from "../../../types/router.types"

import ClearCompleteTodosByTaskIdController from "../clear-complete-todos-by-task-id-controller.interface"

export default class ClearCompleteTodoByTaskIdControllerImplementation
  implements ClearCompleteTodosByTaskIdController
{
  public async execute(_request: AdaptedRequest<null>): Promise<ControllerResponse<undefined>> {
    throw new Error("Method not implemented.")
  }
}
