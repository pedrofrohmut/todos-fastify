import { AdaptedRequest } from "../../../../utils/types/controller/util.types"
import { DeleteTodoResponse } from "../../../types/controller/response.types"

import DeleteTodoController from "../delete-todo-controller.interface"

export default class DeleteTodoControllerImplementation implements DeleteTodoController {
  public constructor() {}

  public async execute(_request: AdaptedRequest): Promise<DeleteTodoResponse> {
    throw new Error("Method not implemented.")
  }
}
