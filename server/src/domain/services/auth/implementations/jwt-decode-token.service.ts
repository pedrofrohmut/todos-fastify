import * as jwt from "jsonwebtoken"

import { AuthenticationToken } from "../../../types/auth/token.types"

import DecodeTokenService from "../decode-token-service.interface"

import InvalidTokenError from "../../../errors/auth/invalid-token.error"
import ExpiredTokenError from "../../../errors/auth/expired-token.error"

export default class JwtDecodeTokenService implements DecodeTokenService {
  private readonly secret: string

  constructor(secret: string) {
    this.secret = secret
  }

  private validateToken(token: string, errorMessage: string): void {
    if (!token || typeof token !== "string") {
      throw new InvalidTokenError(errorMessage)
    }
  }

  public execute(token: string): AuthenticationToken {
    const errorMessage = "[JwtDecodeTokenService] execute"
    this.validateToken(token, errorMessage)
    try {
      const decodedToken = jwt.verify(token, this.secret) as AuthenticationToken
      return decodedToken
    } catch (err) {
      if (err instanceof jwt.JsonWebTokenError && err instanceof jwt.TokenExpiredError === false) {
        throw new InvalidTokenError(errorMessage)
      }
      if (err instanceof jwt.TokenExpiredError) {
        throw new ExpiredTokenError(errorMessage)
      }
      throw err
    }
  }
}
