import { CreateTodoBody } from "../../types/request/body.types"
import { AdaptedRequest, ControllerResponse } from "../../types/router.types"

export default interface CreateTodoController {
  execute(request: AdaptedRequest<CreateTodoBody>): Promise<ControllerResponse<undefined>>
}
