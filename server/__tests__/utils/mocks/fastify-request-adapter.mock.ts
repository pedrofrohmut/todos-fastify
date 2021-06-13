import { FastifyRequest } from "fastify"

import { AdaptedRequest } from "../../../src/domain/types/router.types"

import RequestAdapter from "../../../src/fastify/router/request-adapter.interface"

import InvalidRequestBodyError from "../../../src/domain/errors/request/invalid-request-body.error"
import InvalidRequestHeadersError from "../../../src/domain/errors/request/invalid-request-headers.error"
import InvalidRequestParamsError from "../../../src/domain/errors/request/invalid-request-params.error"
import InvalidRequestTokenError from "../../../src/domain/errors/request/invalid-request-token.error"

export class MockFastifyRequestAdapter implements RequestAdapter {
  public adapt(request: FastifyRequest): AdaptedRequest {
    if (request.body && typeof request.body !== "object") {
      throw new InvalidRequestBodyError("[MockFastifyRequestAdapter] body")
    }
    if (request.headers && typeof request.headers !== "object") {
      throw new InvalidRequestHeadersError("[MockFastifyRequestAdapter] headers")
    }
    const token = request.headers.authentication_token
    if (token && typeof token !== "string") {
      throw new InvalidRequestTokenError("[MockFastifyRequestAdapter] token")
    }
    if (request.params && typeof request.params !== "object") {
      throw new InvalidRequestParamsError("[MockFastifyRequestAdapter] params")
    }
    return {
      body: null,
      authUserId: null,
      params: null
    }
  }
}
