import { DeleteTodoRequest } from "../../types/controller/request.types"
import { DeleteTodoResponse } from "../../types/controller/response.types"

export default interface DeleteTodoController {
  execute(request: DeleteTodoRequest): Promise<DeleteTodoResponse>
}
