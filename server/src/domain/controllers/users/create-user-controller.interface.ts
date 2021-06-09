import { AdaptedRequest } from "../../../utils/types/controller/util.types"
import { CreateUserResponse } from "../../types/controller/response.types"

export default interface CreateUserController {
  execute(request: AdaptedRequest): Promise<CreateUserResponse>
}
