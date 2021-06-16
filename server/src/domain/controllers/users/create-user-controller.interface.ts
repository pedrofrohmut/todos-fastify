import { CreateUserBody } from "../../types/request/body.types"
import { AdaptedRequest, ControllerResponse } from "../../types/router.types"

export default interface CreateUserController {
  execute(request: AdaptedRequest<CreateUserBody>): Promise<ControllerResponse<undefined>>
}
