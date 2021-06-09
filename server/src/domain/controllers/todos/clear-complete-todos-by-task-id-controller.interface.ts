import { AdaptedRequest } from "../../../utils/types/controller/util.types"
import { ClearCompleteTodosByTaskIdResponse } from "../../types/controller/response.types"

export default interface ClearCompleteTodosByTaskIdController {
  execute(request: AdaptedRequest): Promise<ClearCompleteTodosByTaskIdResponse>
}
