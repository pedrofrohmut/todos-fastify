import { DeleteTaskRequest } from "../../../types/controller/request.types"
import { DeleteTaskResponse } from "../../../types/controller/response.types"

import DeleteTaskController from "../delete-task-controller.interface"

export default class DeleteTaskControllerImplementation implements DeleteTaskController {
  public constructor() {}

  public async execute(_request: DeleteTaskRequest): Promise<DeleteTaskResponse> {
    throw new Error("Method not implemented.")
  }
}
