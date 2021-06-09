import { AdaptedRequest } from "../../../utils/types/controller/util.types"
import { FindTodoByIdResponse } from "../../types/controller/response.types"

export default interface FindTodoByIdController {
  execute(request: AdaptedRequest): Promise<FindTodoByIdResponse>
}
