import { CreateTaskResponse } from "../../types/controller/response.types"
import { AdaptedRequest } from "../../types/router.types"

export default interface CreateTaskController {
  execute(request: AdaptedRequest): Promise<CreateTaskResponse>
}
