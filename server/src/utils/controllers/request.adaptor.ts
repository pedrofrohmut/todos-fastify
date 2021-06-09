import { FastifyRequest } from "fastify"
import { IncomingHttpHeaders } from "http"

import {
  AdaptedRequest,
  AdaptedRequestBody,
  AdaptedRequestHeaders,
  AdaptedRequestParams
} from "../types/controller/util.types"

export default class RequestAdapter {
  private static adaptRequestBody(body?: any): AdaptedRequestBody {
    if (!body) {
      return null
    }
    if (typeof body !== "object") {
      throw new Error("[RequestAdapter] The request body in not a valid object")
    }
    if (typeof body === "object" && Object.keys(body).length === 0) {
      return null
    }
    return body
  }

  private static adaptRequestHeaders(headers?: IncomingHttpHeaders): AdaptedRequestHeaders {
    if (typeof headers !== "object") {
      throw new Error("[RequestAdapter] The request headers is not a valid object")
    }
    if (!headers || !headers.authentication_token || Object.keys(headers).length === 0) {
      return null
    }
    if (typeof headers.authentication_token !== "string") {
      throw new Error(
        "[RequestAdapter] The request headers authentication_token is not a valid string"
      )
    }
    return {
      authenticationToken: headers.authentication_token
    }
  }

  private static adaptRequestParams(params?: any): AdaptedRequestParams {
    if (!params) {
      return null
    }
    if (typeof params !== "object") {
      throw new Error("[RequestAdapter] The request params is not a valid object")
    }
    if (typeof params === "object" && Object.keys(params).length === 0) {
      return null
    }
    return params
  }

  public static adapt(request: FastifyRequest): AdaptedRequest {
    return {
      body: RequestAdapter.adaptRequestBody(request.body),
      headers: RequestAdapter.adaptRequestHeaders(request.headers),
      params: RequestAdapter.adaptRequestParams(request.params)
    }
  }
}
