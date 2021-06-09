import { AdaptedRequest } from "../../../../utils/types/controller/util.types"
import { CreateTaskResponse } from "../../../types/controller/response.types"
import { CreateTaskBody } from "../../../types/controller/body.types"

import CreateTaskController from "../create-task-controller.interface"
import CreateTaskUseCase from "../../../usecases/tasks/create-task-usecase.interface"

import CreateTaskUseCaseImplementation from "../../../usecases/tasks/implementations/create-task.usecase"

import TaskValidator from "../../../validators/task.validator"
import UserValidator from "../../../validators/user.validator"

import ControllerDependencyError from "../../../errors/dependencies/controller-dependency.error"
import RequestNotDefinedError from "../../../errors/controllers/request-not-defined.error"
import MissingRequestBodyError from "../../../errors/controllers/missing-request-body.error"
import RequestHeadersValdator from "../../../validators/request-header.validator"

export default class CreateTaskControllerImplementation implements CreateTaskController {
  private readonly createTaskUseCase: CreateTaskUseCase

  public constructor(createTaskUseCase: CreateTaskUseCase) {
    if (
      !createTaskUseCase ||
      createTaskUseCase instanceof CreateTaskUseCaseImplementation === false
    ) {
      throw new ControllerDependencyError()
    }
    this.createTaskUseCase = createTaskUseCase
  }

  private validateRequest(request: AdaptedRequest) {
    if (request === null || request === undefined || typeof request !== "object") {
      throw new RequestNotDefinedError()
    }
  }

  private validateBody(body: CreateTaskBody | null): string | null {
    if (body === null) {
      return new MissingRequestBodyError("[CreateTaskController] Required request body").message
    }
    const { name, description, userId } = body
    const nameValidationMessage = TaskValidator.getMessageForName(name)
    if (nameValidationMessage !== null) {
      return nameValidationMessage
    }
    const descriptionValidationMessage = TaskValidator.getMessageForDescription(description)
    if (descriptionValidationMessage !== null) {
      return descriptionValidationMessage
    }
    const userIdValidationMessage = UserValidator.getMessageForId(userId)
    if (userIdValidationMessage !== null) {
      return userIdValidationMessage
    }
    return null
  }

  public async execute(request: AdaptedRequest): Promise<CreateTaskResponse> {
    this.validateRequest(request)
    const bodyValidationMessage = this.validateBody(request.body)
    if (bodyValidationMessage !== null) {
      return { status: 400, body: bodyValidationMessage }
    }
    const authValidationMessage = RequestHeadersValdator.getMessageForAuthentication(
      request.headers
    )
    if (authValidationMessage !== null) {
      return { status: 401, body: authValidationMessage }
    }
    return { status: 201 }
  }
}
