import { FastifyRequest } from "fastify"

import { AdaptedRequest, Params } from "../../../domain/types/router.types"
import { AuthenticationToken } from "../../../domain/types/auth/token.types"

import TokenDecoderService from "../../../domain/services/auth/token-decoder-service.interface"

import ExpiredTokenError from "../../../domain/errors/auth/expired-token.error"
import InvalidRequestBodyError from "../../../domain/errors/request/invalid-request-body.error"
import InvalidRequestError from "../../../domain/errors/request/invalid-request.error"
import InvalidRequestHeadersError from "../../../domain/errors/request/invalid-request-headers.error"
import InvalidRequestParamsError from "../../../domain/errors/request/invalid-request-params.error"
import InvalidTokenError from "../../../domain/errors/auth/invalid-token.error"
import InvalidTokenUserIdError from "../../../domain/errors/auth/invalid-token-user-id.error"
import RequestNotDefinedError from "../../../domain/errors/request/request-not-defined.error"

import { isValidUUIDv4 } from "../../../domain/validators/validator.functions"

export default class FastifyRequestAdapter {
  private readonly tokenDecoderService: TokenDecoderService

  constructor(tokenDecoderService: TokenDecoderService) {
    this.tokenDecoderService = tokenDecoderService
  }

  private validateRequest(request: any): void {
    if (!request) {
      throw new RequestNotDefinedError("[RequestAdapter] adapt")
    }
    if (typeof request !== "object") {
      throw new InvalidRequestError("[RequestAdapter] adapt")
    }
  }

  private validateBody(body: any): void {
    if (typeof body !== "object") {
      throw new InvalidRequestBodyError("[RequestAdapter] adapt")
    }
  }

  private adaptBody(body: any): null | object {
    if (body === undefined) {
      return null
    }
    this.validateBody(body)
    return body
  }

  private decodeToken(token: string): AuthenticationToken {
    try {
      const decoded = this.tokenDecoderService.execute(token)
      return decoded
    } catch (err) {
      if (err instanceof InvalidTokenError) {
        throw new InvalidTokenError("[RequestAdapter] adapt")
      }
      if (err instanceof ExpiredTokenError) {
        throw new ExpiredTokenError("[RequestAdapter] adapt")
      }
      throw err
    }
  }

  private validateHeaders(headers: any): void {
    if (typeof headers !== "object") {
      throw new InvalidRequestHeadersError("[RequestAdapter] adapt")
    }
  }

  private validateToken(token: any): void {
    if (typeof token !== "string") {
      throw new InvalidTokenError("[RequestAdapter] adapt")
    }
  }

  private validateUserId(userId: string): void {
    if (!userId || (userId && typeof userId !== "string") || !isValidUUIDv4(userId)) {
      throw new InvalidTokenUserIdError("[RequestAdapter] adapt")
    }
  }

  private adaptHeaders(headers: any): null | string {
    if (headers === null || headers === undefined) {
      return null
    }
    this.validateHeaders(headers)
    const token = headers.authentication_token
    if (token === null || token === undefined) {
      return null
    }
    this.validateToken(token)
    const { userId } = this.decodeToken(token)
    this.validateUserId(userId)
    return userId
  }

  private validateParams(params: any): void {
    if (params !== undefined && typeof params !== "object") {
      throw new InvalidRequestParamsError("[RequestAdapter] adapt")
    }
  }

  private adaptParams(params: any): null | Params {
    if (params === undefined) {
      return null
    }
    this.validateParams(params)
    return params
  }

  public adapt(request: FastifyRequest): AdaptedRequest<any> {
    this.validateRequest(request)
    const body = this.adaptBody(request.body)
    const authUserId = this.adaptHeaders(request.headers)
    const params = this.adaptParams(request.params)
    return {
      body,
      authUserId,
      params
    }
  }
}
