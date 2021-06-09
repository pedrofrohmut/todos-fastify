import { AdaptedRequest } from "../../../utils/types/controller/util.types"
import { UpdateTaskResponse } from "../../types/controller/response.types"

export default interface UpdateTaskController {
  execute(request: AdaptedRequest): Promise<UpdateTaskResponse>
}
