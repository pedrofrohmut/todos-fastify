import Controller from "../controller.interface"

import { AdapterRequest } from "../../adapters/controller-adapter.types"
import { ControllerResponse } from "../../types/controller.types"

export default class DeleteTodoController implements Controller {
  private constructor() {}

  public static getInstance() {
    return new DeleteTodoController()
  }

  public async execute(request: AdapterRequest): Promise<ControllerResponse> {
    return {
      status: 204
    }
  }
}
