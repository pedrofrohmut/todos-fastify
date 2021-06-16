import * as jwt from "jsonwebtoken"

import { AuthenticationToken } from "../../../types/auth/token.types"

import TokenDecoderService from "../token-decoder-service.interface"

import InvalidTokenError from "../../../errors/auth/invalid-token.error"
import ExpiredTokenError from "../../../errors/auth/expired-token.error"

export default class JwtTokenDecoderService implements TokenDecoderService {
  private readonly secret: string

  constructor(secret: string) {
    this.secret = secret
  }

  private validateToken(token: string, errorMessage: string): void {
    if (!token || typeof token !== "string") {
      throw new InvalidTokenError(errorMessage)
    }
  }

  private throwDomainError(err: Error, errorMessage: string): void {
    if (err instanceof jwt.JsonWebTokenError && err instanceof jwt.TokenExpiredError === false) {
      throw new InvalidTokenError(errorMessage)
    }
    if (err instanceof jwt.TokenExpiredError) {
      throw new ExpiredTokenError(errorMessage)
    }
    throw err
  }

  public execute(token: string): AuthenticationToken {
    const errorMessage = "[JwtTokenDecoderService] execute"
    this.validateToken(token, errorMessage)
    try {
      const decodedToken = jwt.verify(token, this.secret) as AuthenticationToken
      return decodedToken
    } catch (err) {
      this.throwDomainError(err, errorMessage)
      throw err
    }
  }
}
