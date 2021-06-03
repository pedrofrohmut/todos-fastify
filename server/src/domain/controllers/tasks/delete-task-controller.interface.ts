import { DeleteTaskRequest } from "../../types/controller/request.types"
import { DeleteTaskResponse } from "../../types/controller/response.types"

export default interface DeleteTaskController {
  execute(request: DeleteTaskRequest): Promise<DeleteTaskResponse>
}
