import { AdaptedRequest, ControllerResponse } from "../../../types/router.types"

import DeleteTaskController from "../delete-task-controller.interface"

export default class DeleteTaskControllerImplementation implements DeleteTaskController {
  public async execute(_request: AdaptedRequest<null>): Promise<ControllerResponse<undefined>> {
    throw new Error("Method not implemented.")
  }
}
