import { AdaptedRequest, ControllerResponse } from "../../../types/router.types"

import DeleteTodoController from "../delete-todo-controller.interface"

export default class DeleteTodoControllerImplementation implements DeleteTodoController {
  public async execute(_request: AdaptedRequest<null>): Promise<ControllerResponse<undefined>> {
    throw new Error("Method not implemented.")
  }
}
