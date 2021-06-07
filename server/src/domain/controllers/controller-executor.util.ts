import { FastifyRequest } from "fastify"
import { IncomingHttpHeaders } from "http"

import ControllerExecutor from "./controller-executor.interface"
import {
  AdaptedRequest,
  AdaptedRequestBody,
  AdaptedRequestHeaders,
  AdaptedRequestParams,
  Controller,
  ControllerResponse
} from "./controller-executor.types"
import ControllerFactory from "./controller.factory"

export default class ControllerExecutorImplementation implements ControllerExecutor {
  private readonly request: FastifyRequest

  constructor(request: FastifyRequest) {
    if (!request) {
      throw new Error(
        "[ControllerExecutor] The request is not defined the controller executor cannot be used without it"
      )
    }
    this.request = request
  }

  private adaptRequestBody(body?: any): AdaptedRequestBody {
    if (!body) {
      return null
    }
    if (typeof body !== "object") {
      throw new Error("[ControllerExecutor] The request body in not a valid object")
    }
    return body
  }

  private adaptRequestHeaders(headers?: IncomingHttpHeaders): AdaptedRequestHeaders {
    if (!headers || !headers.authentication_token) {
      return null
    }
    if (typeof headers.authentication_token !== "string") {
      throw new Error(
        "[ControllerExecutor] The request headers authentication_token is not a valid string"
      )
    }
    return {
      authenticationToken: headers.authentication_token
    }
  }

  private adaptRequestParams(params?: any): AdaptedRequestParams {
    if (!params) {
      return null
    }
    if (typeof params !== "object") {
      throw new Error("[ControllerExecutor] The request params is not a valid object")
    }
    return params
  }

  private adaptRequest(request: FastifyRequest): AdaptedRequest {
    return {
      body: this.adaptRequestBody(request.body),
      headers: this.adaptRequestHeaders(request.headers),
      params: this.adaptRequestParams(request.params)
    }
  }

  private validateControllerResponse(controllerResponse: ControllerResponse): void {
    if (!controllerResponse) {
      throw new Error("[ControllerExecutor] The controller did not return a response")
    }
    if (!controllerResponse.status) {
      throw new Error("[ControllerExecutor] The controller did not return a response status")
    }
    if (
      (controllerResponse.status === 201 || controllerResponse.status === 204) &&
      controllerResponse.body
    ) {
      throw new Error(
        "[ControllerExecutor] The controller returned a body when status where 201 or 204"
      )
    }
  }

  public async execute(controller: Function | Controller): Promise<ControllerResponse> {
    let controllerInstance: Function | Controller
    if (typeof controller === "function") {
      controllerInstance = ControllerFactory.getController(controller)
    } else {
      controllerInstance = controller
    }
    if (!controllerInstance) {
      throw new Error("Cannot execute without a controller instance")
    }
    const adaptedRequest = this.adaptRequest(this.request)
    const controllerResponse = await controllerInstance.execute(adaptedRequest)
    this.validateControllerResponse(controllerResponse)
    return controllerResponse
  }
}
