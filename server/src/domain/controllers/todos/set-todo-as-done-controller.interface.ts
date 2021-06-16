import { AdaptedRequest, ControllerResponse } from "../../types/router.types"

export default interface SetTodoAsDoneController {
  execute(request: AdaptedRequest<null>): Promise<ControllerResponse<undefined>>
}
