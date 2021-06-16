import { AdaptedRequest, ControllerResponse } from "../../../types/router.types"
import { Todo } from "../../../types/todo.types"

import FindTodosByTaskIdController from "../find-todos-by-task-id-controller.interface"

export default class FindTodosByTaskIdControllerImplementation
  implements FindTodosByTaskIdController
{
  public async execute(_request: AdaptedRequest<null>): Promise<ControllerResponse<Todo[]>> {
    throw new Error("Method not implemented.")
  }
}
