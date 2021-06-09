import { AdaptedRequest } from "../../../utils/types/controller/util.types"
import { FindTaskByIdResponse } from "../../types/controller/response.types"

export default interface FindTaskByIdController {
  execute(request: AdaptedRequest): Promise<FindTaskByIdResponse>
}
