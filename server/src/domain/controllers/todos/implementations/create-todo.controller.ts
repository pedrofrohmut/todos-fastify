import { CreateTodoBody } from "../../../types/request/body.types"
import { AdaptedRequest, ControllerResponse } from "../../../types/router.types"

import CreateTodoController from "../create-todo-controller.interface"

export default class CreateTodoControllerImplementation implements CreateTodoController {
  public async execute(
    _request: AdaptedRequest<CreateTodoBody>
  ): Promise<ControllerResponse<undefined>> {
    throw new Error("Method not implemented.")
  }
}
