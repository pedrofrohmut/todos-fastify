import { CreateTaskBody } from "../../types/request/body.types"
import { AdaptedRequest, ControllerResponse } from "../../types/router.types"

export default interface CreateTaskController {
  execute(request: AdaptedRequest<CreateTaskBody>): Promise<ControllerResponse<void>>
}
