import { FastifyReply, FastifyRequest } from "fastify"
import { IncomingHttpHeaders } from "http"

import Controller from "../controllers/controller.interface"

import {
  AdapterRequest,
  AdapterRequestBody,
  AdapterRequestHeaders,
  AdapterRequestParams
} from "./controller-adapter.types"
import { ControllerResponse } from "../types/controller.types"

export default class FastifyControllerAdapter {
  private readonly request: FastifyRequest
  private readonly response: FastifyReply

  constructor(request: FastifyRequest, response: FastifyReply) {
    this.request = request
    this.response = response
  }

  private createAdaptedBody(body?: any): AdapterRequestBody {
    if (body === undefined || body === null) {
      return null
    }
    if (typeof body === "object" && Object.keys(body).length === 0) {
      return null
    }
    return body
  }

  private extractToken(authenticationHeader: string): string {
    const splitedHeaders = authenticationHeader.split(" ")
    const token = splitedHeaders[1]
    return token
  }

  private createAdaptedHeaders(headers: IncomingHttpHeaders): AdapterRequestHeaders {
    const authenticationToken = headers.authorization
      ? this.extractToken(headers.authorization)
      : headers.authentication_token
      ? headers.authentication_token
      : null
    if (authenticationToken === null) {
      return null
    }
    return {
      authenticationToken: authenticationToken as string
    }
  }

  private createAdaptedParams(params?: any): AdapterRequestParams {
    if (params === undefined) {
      return null
    }
    if (params.userId === undefined && params.taskId === undefined && params.todoId === undefined) {
      return null
    }
    if (params.userId === "" || params.taskId === "" || params.todoId === "") {
      return null
    }
    return params
  }

  private createAdaptedRequest(request: FastifyRequest): AdapterRequest {
    const { body, headers, params } = request
    const adaptedBody: AdapterRequestBody = this.createAdaptedBody(body)
    const adaptedHeaders: AdapterRequestHeaders = this.createAdaptedHeaders(headers)
    const adaptedParams: AdapterRequestParams = this.createAdaptedParams(params)
    const adaptedRequest: AdapterRequest = {
      body: adaptedBody,
      headers: adaptedHeaders,
      params: adaptedParams
    }
    return adaptedRequest
  }

  public async executeController(controller: Controller): Promise<void> {
    let adaptedRequest = undefined
    let adaptRequestErr = undefined
    try {
      adaptedRequest = this.createAdaptedRequest(this.request)
    } catch (err) {
      adaptRequestErr = err
    }
    if (adaptedRequest === undefined || adaptRequestErr !== undefined) {
      this.response.status(500)
      this.response.send(
        "[ControllerAdapter] Error to adapt the request " +
          (adaptRequestErr ? adaptRequestErr.message : "")
      )
      return
    }
    try {
      const controllerResponse: ControllerResponse = await controller.execute(adaptedRequest)
      this.response.status(controllerResponse.status)
      this.response.send(controllerResponse.body)
    } catch (err) {
      this.response
        .status(500)
        .send("[ControllerAdapter] Error to execute controller " + err.message)
    }
  }
}
