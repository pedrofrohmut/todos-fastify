import { SetTodoAsNotDoneRequest } from "../../types/controller/request.types"
import { SetTodoAsNotDoneResponse } from "../../types/controller/response.types"

export default interface SetTodoAsNotDoneController {
  execute(request: SetTodoAsNotDoneRequest): Promise<SetTodoAsNotDoneResponse>
}
