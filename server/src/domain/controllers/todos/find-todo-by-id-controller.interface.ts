import { AdaptedRequest, ControllerResponse } from "../../types/router.types"
import { Todo } from "../../types/todo.types"

export default interface FindTodoByIdController {
  execute(request: AdaptedRequest<null>): Promise<ControllerResponse<Todo>>
}
