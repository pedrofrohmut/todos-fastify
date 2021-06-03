import { FindTodosByTaskIdRequest } from "../../types/controller/request.types"
import { FindTodosByTaskIdResponse } from "../../types/controller/response.types"

export default interface FindTodosByTaskIdController {
  execute(request: FindTodosByTaskIdRequest): Promise<FindTodosByTaskIdResponse>
}
