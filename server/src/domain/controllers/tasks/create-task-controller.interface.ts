import { AdaptedRequest } from "../../../utils/types/controller/util.types"
import { CreateTaskResponse } from "../../types/controller/response.types"

export default interface CreateTaskController {
  execute(request: AdaptedRequest): Promise<CreateTaskResponse>
}
