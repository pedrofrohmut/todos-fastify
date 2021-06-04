import { CreateTaskRequest } from "../../../types/controller/request.types"
import { CreateTaskResponse } from "../../../types/controller/response.types"

import CreateTaskController from "../create-task-controller.interface"

export default class CreateTaskControllerImplementation implements CreateTaskController {
  public constructor() {}

  public async execute(_request: CreateTaskRequest): Promise<CreateTaskResponse> {
    throw new Error("Method not implemented.")
  }
}
