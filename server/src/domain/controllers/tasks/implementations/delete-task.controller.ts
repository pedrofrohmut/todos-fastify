import { AdaptedRequest } from "../../../../utils/types/controller/util.types"
import { DeleteTaskResponse } from "../../../types/controller/response.types"

import DeleteTaskController from "../delete-task-controller.interface"

export default class DeleteTaskControllerImplementation implements DeleteTaskController {
  public constructor() {}

  public async execute(_request: AdaptedRequest): Promise<DeleteTaskResponse> {
    throw new Error("Method not implemented.")
  }
}
