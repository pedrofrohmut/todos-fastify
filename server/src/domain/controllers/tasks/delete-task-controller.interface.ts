import { AdaptedRequest } from "../../../utils/types/controller/util.types"
import { DeleteTaskResponse } from "../../types/controller/response.types"

export default interface DeleteTaskController {
  execute(request: AdaptedRequest): Promise<DeleteTaskResponse>
}
