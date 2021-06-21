import { AdaptedRequest, ControllerResponse } from "../../../types/router.types"
import { TodoDto } from "../../../types/todo.types"

import FindTodosByTaskIdController from "../find-todos-by-task-id-controller.interface"

export default class FindTodosByTaskIdControllerImplementation
  implements FindTodosByTaskIdController
{
  public async execute(_request: AdaptedRequest<null>): Promise<ControllerResponse<TodoDto[]>> {
    throw new Error("Method not implemented.")
  }
}
