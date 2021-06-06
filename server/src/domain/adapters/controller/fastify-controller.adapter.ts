import { FastifyReply, FastifyRequest } from "fastify"

import { AdaptedRequest, Controller, ControllerResponse } from "./controller-adapter.types"
import RequestBodyAdapter from "./request-body.adapter"
import RequestHeadersAdapter from "./request-headers.adapter"
import RequestParamsAdapter from "./request-params.adapter"

export default class FastifyControllerAdapter {
  private readonly request: FastifyRequest
  private readonly response: FastifyReply

  constructor(request: FastifyRequest, response: FastifyReply) {
    this.request = request
    this.response = response
  }

  private getAdaptedRequest(request: FastifyRequest): AdaptedRequest {
    return {
      body: RequestBodyAdapter.execute(request.body),
      headers: RequestHeadersAdapter.execute(request.headers),
      params: RequestParamsAdapter.execute(request.params)
    }
  }

  private validateControllerResponse(controllerResponse: ControllerResponse): void {
    if (controllerResponse === undefined) {
      throw new Error("Controller did not return a response")
    }
    const { status, body } = controllerResponse
    if (status === undefined) {
      throw new Error("Invalid controller response. It has no status")
    }
    if (status !== 201 && status !== 204 && body === undefined) {
      throw new Error("Controller is missing the response body")
    }
  }

  public async executeController(controller: Controller): Promise<void> {
    if (controller === undefined || controller === null) {
      throw new Error(
        "[FastifyControllerAdapter] Controller is either null or not defined. Adapter cannot proceed."
      )
    }
    let controllerResponse: ControllerResponse
    const adaptedRequest = this.getAdaptedRequest(this.request)
    try {
      controllerResponse = await controller.execute(adaptedRequest)
    } catch (err) {
      this.response
        .status(500)
        .send("[ControllerAdapter] Error to execute the controller. " + err.message)
      return
    }
    this.validateControllerResponse(controllerResponse)
    this.response.status(controllerResponse.status).send(controllerResponse.body)
  }
}
