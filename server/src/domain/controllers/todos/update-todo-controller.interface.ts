import { AdaptedRequest } from "../../../utils/types/controller/util.types"
import { UpdateTodoResponse } from "../../types/controller/response.types"

export default interface UpdateTodoController {
  execute(request: AdaptedRequest): Promise<UpdateTodoResponse>
}
