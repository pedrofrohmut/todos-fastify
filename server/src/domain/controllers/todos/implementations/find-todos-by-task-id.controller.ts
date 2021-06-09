import { AdaptedRequest } from "../../../../utils/types/controller/util.types"
import { FindTodosByTaskIdResponse } from "../../../types/controller/response.types"

import FindTodosByTaskIdController from "../find-todos-by-task-id-controller.interface"

export default class FindTodosByTaskIdControllerImplementation
  implements FindTodosByTaskIdController
{
  public constructor() {}

  public async execute(_request: AdaptedRequest): Promise<FindTodosByTaskIdResponse> {
    throw new Error("Method not implemented.")
  }
}
