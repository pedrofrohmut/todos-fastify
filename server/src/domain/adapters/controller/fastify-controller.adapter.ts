import { FastifyReply, FastifyRequest } from "fastify"
import { IncomingHttpHeaders } from "http"

import {
  AdapterController,
  AdapterRequest,
  AdapterRequestBody,
  AdapterRequestHeaders,
  AdapterRequestParams,
  AdapterResponse
} from "./controller-adapter.types"

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

  private createAdaptedRequest(): AdapterRequest {
    const { body, headers, params } = this.request
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

  private sendAdapterErrorResponse(message: string, error: Error): void {
    this.response.status(500)
    this.response.send(`[ControllerAdapter] ${message}. ${error.message}`)
  }

  private sendControllerResponse(controllerResponse: AdapterResponse): void {
    this.response.status(controllerResponse.status)
    this.response.send(controllerResponse.body)
  }

  public async executeController(controller: AdapterController): Promise<void> {
    let adaptedRequest
    try {
      adaptedRequest = this.createAdaptedRequest()
    } catch (err) {
      this.sendAdapterErrorResponse("Error adapt the request", err)
      return
    }
    let controllerResponse
    try {
      controllerResponse = await controller.execute(adaptedRequest)
    } catch (err) {
      this.sendAdapterErrorResponse("Error to execute controller", err)
      return
    }
    try {
      this.sendControllerResponse(controllerResponse)
    } catch (err) {
      this.sendAdapterErrorResponse("Error to send adapter response", err)
      return
    }
  }
}
