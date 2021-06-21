import { AdaptedRequest, ControllerResponse } from "../../types/router.types"
import { TaskDto } from "../../types/task.types"

export default interface FindTaskByIdController {
  execute(request: AdaptedRequest<null>): Promise<ControllerResponse<TaskDto>>
}
