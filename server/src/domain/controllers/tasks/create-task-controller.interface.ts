import { CreateTaskRequest } from "../../types/controller/request.types"
import { CreateTaskResponse } from "../../types/controller/response.types"

export default interface CreateTaskController {
  execute(request: CreateTaskRequest): Promise<CreateTaskResponse>
}
