import { ClearCompleteTodosByTaskIdRequest } from "../../types/controller/request.types"
import { ClearCompleteTodosByTaskIdResponse } from "../../types/controller/response.types"

export default interface ClearCompleteTodosByTaskIdController {
  execute(request: ClearCompleteTodosByTaskIdRequest): Promise<ClearCompleteTodosByTaskIdResponse>
}
