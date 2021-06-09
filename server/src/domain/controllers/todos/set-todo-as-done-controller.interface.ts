import { AdaptedRequest } from "../../../utils/types/controller/util.types"
import { SetTodoAsDoneResponse } from "../../types/controller/response.types"

export default interface SetTodoAsDoneController {
  execute(request: AdaptedRequest): Promise<SetTodoAsDoneResponse>
}
