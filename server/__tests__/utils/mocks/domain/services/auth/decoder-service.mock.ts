import { JsonWebTokenError, NotBeforeError, TokenExpiredError, verify } from "jsonwebtoken"

import { AuthenticationToken } from "../../../../../../src/domain/types/auth/token.types"

import DecodeTokenService from "../../../../../../src/domain/services/auth/decode-token-service.interface"

import ServerMissingJwtSecret from "../../../../../../src/domain/errors/auth/server-missing-jwt-secret.error"
import ExpiredTokenError from "../../../../../../src/domain/errors/auth/expired-token.error"
import InvalidTokenError from "../../../../../../src/domain/errors/auth/invalid-token.error"

export class MockDecoderService implements DecodeTokenService {
  public execute(token: string): AuthenticationToken {
    if (!process.env.JWT_SECRET) {
      throw new ServerMissingJwtSecret("[MockDecoderService] execute")
    }
    try {
      const decodedToken = verify(token, process.env.JWT_SECRET)
      return decodedToken as AuthenticationToken
    } catch (err) {
      if (err instanceof TokenExpiredError) {
        throw new ExpiredTokenError("[MockDecoderService] execute")
      }
      if (
        (err instanceof JsonWebTokenError || err instanceof NotBeforeError) &&
        err instanceof TokenExpiredError === false
      ) {
        throw new InvalidTokenError("[MockDecoderService] execute")
      }
      throw err
    }
  }
}
