import { UpdateTaskBody } from "../../../types/request/body.types"
import { AdaptedRequest, ControllerResponse } from "../../../types/router.types"

import UpdateTaskController from "../update-task-controller.interface"

export default class UpdateTaskControllerImplementation implements UpdateTaskController {
  public async execute(
    _request: AdaptedRequest<UpdateTaskBody>
  ): Promise<ControllerResponse<undefined>> {
    throw new Error("Method not implemented.")
  }
}
