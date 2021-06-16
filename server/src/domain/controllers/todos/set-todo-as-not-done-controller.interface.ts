import { AdaptedRequest, ControllerResponse } from "../../types/router.types"

export default interface SetTodoAsNotDoneController {
  execute(request: AdaptedRequest<null>): Promise<ControllerResponse<undefined>>
}
