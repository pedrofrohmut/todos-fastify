import { AdaptedRequest, ControllerResponse } from "../../../types/router.types"
import SetTodoAsNotDoneController from "../set-todo-as-not-done-controller.interface"

export default class SetTodoAsNotDoneControllerImplementation
  implements SetTodoAsNotDoneController
{
  public async execute(_request: AdaptedRequest<null>): Promise<ControllerResponse<undefined>> {
    throw new Error("Method not implemented.")
  }
}
