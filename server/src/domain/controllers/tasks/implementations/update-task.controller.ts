import { UpdateTaskRequest } from "../../../types/controller/request.types"
import { UpdateTaskResponse } from "../../../types/controller/response.types"

import UpdateTaskController from "../update-task-controller.interface"

export default class UpdateTaskControllerImplementation implements UpdateTaskController {
  public constructor() {}

  public async execute(_request: UpdateTaskRequest): Promise<UpdateTaskResponse> {
    throw new Error("Method not implemented.")
  }
}
