import { AdaptedRequest } from "../../../utils/types/controller/util.types"
import { CreateTodoResponse } from "../../types/controller/response.types"

export default interface CreateTodoController {
  execute(request: AdaptedRequest): Promise<CreateTodoResponse>
}
