import { UpdateTodoBody } from "../../types/request/body.types"
import { AdaptedRequest, ControllerResponse } from "../../types/router.types"

export default interface UpdateTodoController {
  execute(request: AdaptedRequest<UpdateTodoBody>): Promise<ControllerResponse<undefined>>
}
