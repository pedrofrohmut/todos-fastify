import { UpdateTaskRequest } from "../../types/controller/request.types"
import { UpdateTaskResponse } from "../../types/controller/response.types"

export default interface UpdateTaskController {
  execute(request: UpdateTaskRequest): Promise<UpdateTaskResponse>
}
