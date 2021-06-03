import Controller from "../controller.interface"

import { AdapterRequest } from "../../adapters/controller-adapter.types"
import { ControllerResponse } from "../../types/controller.types"

export default class SetTodoAsNotDoneController implements Controller {
  private constructor() {}

  public static getInstance() {
    return new SetTodoAsNotDoneController()
  }

  public async execute(request: AdapterRequest): Promise<ControllerResponse> {
    return {
      status: 204
    }
  }
}
