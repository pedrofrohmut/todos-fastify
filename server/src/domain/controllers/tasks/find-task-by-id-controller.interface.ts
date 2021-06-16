import { AdaptedRequest, ControllerResponse } from "../../types/router.types"
import { Task } from "../../types/task.types"

export default interface FindTaskByIdController {
  execute(request: AdaptedRequest<null>): Promise<ControllerResponse<Task>>
}
