import { AdaptedRequest } from "../../../utils/types/controller/util.types"
import { FindTodosByTaskIdResponse } from "../../types/controller/response.types"

export default interface FindTodosByTaskIdController {
  execute(request: AdaptedRequest): Promise<FindTodosByTaskIdResponse>
}
