import { CreateTodoRequest } from "../../../types/controller/request.types"
import { CreateTodoResponse } from "../../../types/controller/response.types"

import CreateTodoController from "../create-todo-controller.interface"

export default class CreateTodoControllerImplementation implements CreateTodoController {
  public constructor() {}

  public async execute(_request: CreateTodoRequest): Promise<CreateTodoResponse> {
    throw new Error("Method not implemented.")
  }
}
