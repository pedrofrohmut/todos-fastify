import { AdaptedRequest } from "../../../../utils/types/controller/util.types"
import { ClearCompleteTodosByTaskIdResponse } from "../../../types/controller/response.types"

import ClearCompleteTodosByTaskIdController from "../clear-complete-todos-by-task-id-controller.interface"

export default class ClearCompleteTodoByTaskIdControllerImplementation
  implements ClearCompleteTodosByTaskIdController
{
  public constructor() {}

  public async execute(_request: AdaptedRequest): Promise<ClearCompleteTodosByTaskIdResponse> {
    throw new Error("Method not implemented.")
  }
}
