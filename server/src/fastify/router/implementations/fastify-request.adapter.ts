import { FastifyRequest } from "fastify"

import { AdaptedRequest } from "../../../domain/types/router.types"

import InvalidTokenError from "../../../domain/errors/auth/invalid-token.error"
import InvalidRequestBodyError from "../../../domain/errors/request/invalid-request-body.error"
import InvalidRequestHeadersError from "../../../domain/errors/request/invalid-request-headers.error"
import InvalidRequestParamsError from "../../../domain/errors/request/invalid-request-params.error"

export default class FastifyRequestAdapter {
  public adapt(request: FastifyRequest): AdaptedRequest {
    if (typeof request.body !== "object") {
      throw new InvalidRequestBodyError("[RequestAdapter] adapt")
    }
    if (typeof request.headers !== "object") {
      throw new InvalidRequestHeadersError("[RequestAdapter] adapt")
    }
    const token = request.headers.authentication_token
    if (token !== undefined && typeof token !== "string") {
      throw new InvalidTokenError("[RequestAdapter] adapt")
    }
    if (request.params !== undefined && typeof request.params !== "object") {
      throw new InvalidRequestParamsError("[RequestAdapter] adapt")
    }
    // TODO: Adapt the request not only pass it away
    return request
  }
}
