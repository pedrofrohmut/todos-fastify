import { FindTodoByIdRequest } from "../../types/controller/request.types"
import { FindTodoByIdResponse } from "../../types/controller/response.types"

export default interface FindTodoByIdController {
  execute(request: FindTodoByIdRequest): Promise<FindTodoByIdResponse>
}
