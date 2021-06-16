import { UpdateTodoBody } from "../../../types/request/body.types"
import { AdaptedRequest, ControllerResponse } from "../../../types/router.types"

import UpdateTodoController from "../update-todo-controller.interface"

export default class UpdateTodoControllerImplementation implements UpdateTodoController {
  public async execute(
    _request: AdaptedRequest<UpdateTodoBody>
  ): Promise<ControllerResponse<undefined>> {
    throw new Error("Method not implemented.")
  }
}
