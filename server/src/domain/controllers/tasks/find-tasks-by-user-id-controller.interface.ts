import { AdaptedRequest, ControllerResponse } from "../../types/router.types"
import { TaskDto } from "../../types/task.types"

export default interface FindTasksByUserIdController {
  execute(request: AdaptedRequest<null>): Promise<ControllerResponse<TaskDto[]>>
}
