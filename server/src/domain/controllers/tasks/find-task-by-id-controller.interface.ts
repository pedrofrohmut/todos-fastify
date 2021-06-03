import { FindTaskByIdRequest } from "../../types/controller/request.types"
import { FindTaskByIdResponse } from "../../types/controller/response.types"

export default interface FindTaskByIdController {
  execute(request: FindTaskByIdRequest): Promise<FindTaskByIdResponse>
}
