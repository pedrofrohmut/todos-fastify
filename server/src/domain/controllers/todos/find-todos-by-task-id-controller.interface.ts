import { AdaptedRequest, ControllerResponse } from "../../types/router.types"
import { TodoDto } from "../../types/todo.types"

export default interface FindTodosByTaskIdController {
  execute(request: AdaptedRequest<null>): Promise<ControllerResponse<TodoDto[]>>
}
