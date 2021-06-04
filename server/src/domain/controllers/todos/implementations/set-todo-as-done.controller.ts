import { SetTodoAsDoneRequest } from "../../../types/controller/request.types"
import { SetTodoAsDoneResponse } from "../../../types/controller/response.types"

import SetTodoAsDoneController from "../set-todo-as-done-controller.interface"

export default class SetTodoAsDoneControllerImplementation implements SetTodoAsDoneController {
  public constructor() {}

  public async execute(_request: SetTodoAsDoneRequest): Promise<SetTodoAsDoneResponse> {
    throw new Error("Method not implemented.")
  }
}
