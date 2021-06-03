import { UpdateTodoRequest } from "../../types/controller/request.types"
import { UpdateTodoResponse } from "../../types/controller/response.types"

export default interface UpdateTodoController {
  execute(request: UpdateTodoRequest): Promise<UpdateTodoResponse>
}
