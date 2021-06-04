import { FindTodoByIdRequest } from "../../../types/controller/request.types"
import { FindTodoByIdResponse } from "../../../types/controller/response.types"

import FindTodoByIdController from "../find-todo-by-id-controller.interface"

export default class FindTodoByIdControllerImplementation implements FindTodoByIdController {
  public constructor() {}

  public async execute(_request: FindTodoByIdRequest): Promise<FindTodoByIdResponse> {
    throw new Error("Method not implemented.")
  }
}
