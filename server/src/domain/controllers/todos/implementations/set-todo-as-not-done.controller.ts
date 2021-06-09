import { AdaptedRequest } from "../../../../utils/types/controller/util.types"
import { SetTodoAsNotDoneResponse } from "../../../types/controller/response.types"

import SetTodoAsNotDoneController from "../set-todo-as-not-done-controller.interface"

export default class SetTodoAsNotDoneControllerImplementation
  implements SetTodoAsNotDoneController
{
  public constructor() {}

  public async execute(_request: AdaptedRequest): Promise<SetTodoAsNotDoneResponse> {
    throw new Error("Method not implemented.")
  }
}
