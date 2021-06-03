import { FindTasksByUserIdRequest } from "../../types/controller/request.types"
import { FindTasksByUserIdResponse } from "../../types/controller/response.types"

export default interface FindTasksByUserIdController {
  execute(request: FindTasksByUserIdRequest): Promise<FindTasksByUserIdResponse>
}
