import { AdaptedRequest, ControllerResponse } from "../../types/router.types"

export default interface DeleteTaskController {
  execute(request: AdaptedRequest<null>): Promise<ControllerResponse<undefined>>
}
