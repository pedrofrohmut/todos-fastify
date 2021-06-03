import { SetTodoAsDoneRequest } from "../../types/controller/request.types"
import { SetTodoAsDoneResponse } from "../../types/controller/response.types"

export default interface SetTodoAsDoneController {
  execute(request: SetTodoAsDoneRequest): Promise<SetTodoAsDoneResponse>
}
