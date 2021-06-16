import { AdaptedRequest, ControllerResponse } from "../../../types/router.types"

import SetTodoAsDoneController from "../set-todo-as-done-controller.interface"

export default class SetTodoAsDoneControllerImplementation implements SetTodoAsDoneController {
  public async execute(_request: AdaptedRequest<null>): Promise<ControllerResponse<undefined>> {
    throw new Error("Method not implemented.")
  }
}
