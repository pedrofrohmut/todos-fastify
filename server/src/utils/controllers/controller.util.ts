import { FastifyReply, FastifyRequest } from "fastify"

import ControllerFactory from "../../domain/factories/controller.factory"
import ControllerResponseValidator from "./controller-response.validator"
import RequestAdapter from "./request.adaptor"
import { AdaptedRequest, Controller } from "../types/controller/util.types"

export default class ControllerUtil {
  private readonly request: FastifyRequest
  private readonly response: FastifyReply

  public constructor(request: FastifyRequest, response: FastifyReply) {
    if (!request || !response) {
      throw new Error("[ControllerUtil] Error to construct. Invalid dependencies injected")
    }
    this.request = request
    this.response = response
  }

  public async workOn(controller: Function | Controller): Promise<void> {
    let adaptedRequest: AdaptedRequest
    try {
      adaptedRequest = RequestAdapter.adapt(this.request)
    } catch (err) {
      this.response.status(400).send(err.message)
      return
    }
    try {
      const controllerInstance =
        typeof controller === "function" ? ControllerFactory.getController(controller) : controller
      const controllerResponse = await controllerInstance.execute(adaptedRequest)
      ControllerResponseValidator.validate(controllerResponse)
      const { status, body } = controllerResponse
      this.response.status(status).send(body)
    } catch (err) {
      this.response.status(500).send(err.message)
    }
  }
}
