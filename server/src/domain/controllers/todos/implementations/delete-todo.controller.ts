import { DeleteTodoRequest } from "../../../types/controller/request.types"
import { DeleteTodoResponse } from "../../../types/controller/response.types"

import DeleteTodoController from "../delete-todo-controller.interface"

export default class DeleteTodoControllerImplementation implements DeleteTodoController {
  public constructor() {}

  public async execute(_request: DeleteTodoRequest): Promise<DeleteTodoResponse> {
    throw new Error("Method not implemented.")
  }
}
