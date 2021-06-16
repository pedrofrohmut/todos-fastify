import { AdaptedRequest, ControllerResponse } from "../../types/router.types"

export default interface DeleteTodoController {
  execute(request: AdaptedRequest<null>): Promise<ControllerResponse<undefined>>
}
