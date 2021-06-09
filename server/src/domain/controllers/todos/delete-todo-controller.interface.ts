import { AdaptedRequest } from "../../../utils/types/controller/util.types"
import { DeleteTodoResponse } from "../../types/controller/response.types"

export default interface DeleteTodoController {
  execute(request: AdaptedRequest): Promise<DeleteTodoResponse>
}
