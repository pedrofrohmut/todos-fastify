import { AdaptedRequest } from "../../../utils/types/controller/util.types"
import { SetTodoAsNotDoneResponse } from "../../types/controller/response.types"

export default interface SetTodoAsNotDoneController {
  execute(request: AdaptedRequest): Promise<SetTodoAsNotDoneResponse>
}
