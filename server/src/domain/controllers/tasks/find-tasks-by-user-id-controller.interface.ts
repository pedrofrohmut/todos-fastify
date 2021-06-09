import { AdaptedRequest } from "../../../utils/types/controller/util.types"
import { FindTasksByUserIdResponse } from "../../types/controller/response.types"

export default interface FindTasksByUserIdController {
  execute(request: AdaptedRequest): Promise<FindTasksByUserIdResponse>
}
