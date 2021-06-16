import { UpdateTaskBody } from "../../types/request/body.types"
import { AdaptedRequest, ControllerResponse } from "../../types/router.types"

export default interface UpdateTaskController {
  execute(request: AdaptedRequest<UpdateTaskBody>): Promise<ControllerResponse<undefined>>
}
