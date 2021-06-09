import { AdaptedRequest } from "../../../../utils/types/controller/util.types"
import { UpdateTodoResponse } from "../../../types/controller/response.types"

import UpdateTodoController from "../update-todo-controller.interface"

export default class UpdateTodoControllerImplementation implements UpdateTodoController {
  public construntor() {}

  public async execute(_request: AdaptedRequest): Promise<UpdateTodoResponse> {
    throw new Error("Method not implemented.")
  }
}
