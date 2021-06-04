import { FastifyReply, FastifyRequest } from "fastify"
import { IncomingHttpHeaders } from "http"

import {
  AdaptedRequest,
  AdaptedRequestBody,
  AdaptedRequestHeaders,
  AdaptedRequestParams,
  Controller,
  ControllerResponse
} from "./controller-adapter.types"

export default class FastifyControllerAdapter {
  private readonly request: FastifyRequest
  private readonly response: FastifyReply

  constructor(request: FastifyRequest, response: FastifyReply) {
    this.request = request
    this.response = response
  }

  private createAdaptedBody(body?: any): AdaptedRequestBody {
    if (
      body === undefined ||
      body === null ||
      (typeof body === "object" && Object.keys(body).length === 0)
    ) {
      return null
    }
    return body
  }

  private extractToken(authenticationHeader: string): string {
    const splitedHeaders = authenticationHeader.split(" ")
    const token = splitedHeaders[1]
    return token
  }

  private createAdaptedHeaders(headers?: IncomingHttpHeaders): AdaptedRequestHeaders {
    if (headers === null || headers === undefined) {
      return null
    }
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

  private createAdaptedParams(params?: any): AdaptedRequestParams {
    if (params === null || params === undefined) {
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

  private createAdaptedRequest(request: FastifyRequest): AdaptedRequest {
    try {
      const { body, headers, params } = request
      const adaptedBody = this.createAdaptedBody(body)
      const adaptedHeaders = this.createAdaptedHeaders(headers)
      const adaptedParams = this.createAdaptedParams(params)
      return {
        body: adaptedBody,
        headers: adaptedHeaders,
        params: adaptedParams
      }
    } catch (err) {
      throw new Error("[ControllerAdapter] Error adapt the request. " + err.message)
    }
  }

  private async executeController(
    controller: Controller,
    adaptedRequest: AdaptedRequest
  ): Promise<ControllerResponse> {
    try {
      const controllerResponse = await controller.execute(adaptedRequest)
      return controllerResponse
    } catch (err) {
      throw new Error("[ControllerAdapter] Error to execute controller. " + err.message)
    }
  }

  private sendFastifyResponse(status: number, body: any): void {
    this.response.status(status)
    this.response.send(body)
  }

  public async execute(controller: Controller): Promise<void> {
    try {
      const adaptedRequest = this.createAdaptedRequest(this.request)
      const { status, body } = await this.executeController(controller, adaptedRequest)
      this.sendFastifyResponse(status, body)
    } catch (err) {
      this.sendFastifyResponse(500, err.message)
    }
  }
}
