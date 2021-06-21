import { AdaptedRequest, ControllerResponse } from "../../../types/router.types"
import { TodoDto } from "../../../types/todo.types"

import FindTodoByIdController from "../find-todo-by-id-controller.interface"

export default class FindTodoByIdControllerImplementation implements FindTodoByIdController {
  public async execute(_request: AdaptedRequest<null>): Promise<ControllerResponse<TodoDto>> {
    throw new Error("Method not implemented.")
  }
}
