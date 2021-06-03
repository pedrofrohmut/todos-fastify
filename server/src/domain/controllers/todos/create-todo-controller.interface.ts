import { CreateTodoRequest } from "../../types/controller/request.types"
import { CreateTodoResponse } from "../../types/controller/response.types"

export default interface CreateTodoController {
  execute(request: CreateTodoRequest): Promise<CreateTodoResponse>
}
