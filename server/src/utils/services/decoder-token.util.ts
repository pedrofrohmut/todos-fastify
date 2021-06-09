import { JsonWebTokenError, NotBeforeError, TokenExpiredError, verify } from "jsonwebtoken"

import ExpiredTokenError from "../../domain/errors/auth/expired-token.error"
import InvalidTokenError from "../../domain/errors/auth/invalid-token.error"
import ServerMissingJWTSecretError from "../../domain/errors/auth/server-missing-jwt-secret.error"

export default class DecoderTokenUtil {
  public static decode(token?: string): null | { userId: string } {
    if (!token) {
      return null
    }
    if (!process.env.JWT_SECRET) {
      throw new ServerMissingJWTSecretError("[DecoderTokenUtil] missing JWT Secret in env")
    }
    try {
      const decoded = verify(token, process.env.JWT_SECRET) as { userId: string }
      return decoded
    } catch (err) {
      if (err instanceof TokenExpiredError) {
        throw new ExpiredTokenError("[DecoderTokenUtil] expired error wrapped")
      }
      if (
        (err instanceof JsonWebTokenError || err instanceof NotBeforeError) &&
        err instanceof TokenExpiredError === false
      ) {
        throw new InvalidTokenError("[DecoderTokenUtil] invalid and not before errors wrapped")
      }
      throw err
    }
  }
}
