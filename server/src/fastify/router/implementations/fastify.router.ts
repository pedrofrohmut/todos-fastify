import { FastifyReply, FastifyRequest } from "fastify"

import Router from "../router.interface"
import RequestAdapter from "../request-adapter.interface"
import ControllerFactory from "../../../domain/factories/controller-factory.interface"
import ControllerResponseValidator from "../../../domain/validators/controller-response-validator.interface"

import { AdaptedRequest, Controller } from "../../../domain/types/router.types"

import DependencyInjectionError from "../../../domain/errors/dependencies/dependency-injection.error"

export default class FastifyRouter implements Router {
  private readonly request: FastifyRequest
  private readonly response: FastifyReply
  private readonly requestAdapter: RequestAdapter
  private readonly controllerFactory: ControllerFactory
  private readonly controllerResponseValidator: ControllerResponseValidator

  constructor(
    request: FastifyRequest,
    response: FastifyReply,
    requestAdapter: RequestAdapter,
    controllerFactory: ControllerFactory,
    controllerResponseValidator: ControllerResponseValidator
  ) {
    if (
      request === null ||
      request === undefined ||
      typeof request !== "object" ||
      response === null ||
      response === undefined ||
      typeof response !== "object"
    ) {
      throw new DependencyInjectionError("[FastifyRouter] constructor")
    }
    this.request = request
    this.response = response
    this.requestAdapter = requestAdapter
    this.controllerFactory = controllerFactory
    this.controllerResponseValidator = controllerResponseValidator
  }

  private getControllerInstace(controller: Function | Controller): Controller {
    if (
      controller === null ||
      controller === undefined ||
      (typeof controller !== "object" && typeof controller !== "function") ||
      (typeof controller === "object" && controller.execute === undefined)
    ) {
      throw new DependencyInjectionError("[FastifyRouter] route controller")
    }
    const instance =
      typeof controller === "function"
        ? this.controllerFactory.getController(controller)
        : controller
    return instance as Controller
  }

  public async routeController(controller: Function | Controller): Promise<void> {
    let adaptedRequest: AdaptedRequest
    try {
      adaptedRequest = this.requestAdapter.adapt(this.request)
    } catch (err) {
      this.response.status(400).send(err.message)
      return
    }
    try {
      const controllerInstance = this.getControllerInstace(controller)
      const controllerResponse = await controllerInstance.execute(adaptedRequest)
      this.controllerResponseValidator.validate(controllerResponse)
      const { status, body } = controllerResponse
      this.response.status(status).send(body)
    } catch (err) {
      this.response.status(500).send("TODO")
    }
  }
}
