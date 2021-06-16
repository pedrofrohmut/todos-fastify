import { AdaptedRequest, ControllerResponse } from "../../types/router.types"

export default interface ClearCompleteTodosByTaskIdController {
  execute(request: AdaptedRequest<null>): Promise<ControllerResponse<undefined>>
}
