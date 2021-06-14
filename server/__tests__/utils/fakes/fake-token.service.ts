import { v4 as uuid } from "uuid"
import { JsonWebTokenError, sign, TokenExpiredError, NotBeforeError, verify } from "jsonwebtoken"

import ExpiredTokenError from "../../../src/domain/errors/auth/expired-token.error"
import InvalidTokenError from "../../../src/domain/errors/auth/invalid-token.error"

export default class FakeTokenService {
  private static getUserId(id?: string): string {
    return id !== undefined ? id : uuid()
  }

  public static getValid(userId?: string): string {
    const token = sign({ userId: this.getUserId(userId) }, process.env.JWT_SECRET, {
      expiresIn: 60
    })
    return token
  }

  public static getExpired(userId?: string): string {
    const token = sign({ userId: this.getUserId(userId) }, process.env.JWT_SECRET, { expiresIn: 0 })
    return token
  }

  public static decode(token?: string): { userId: string } {
    if (!token) {
      return null
    }
    try {
      const decoded = verify(token, process.env.JWT_SECRET) as { userId: string }
      return decoded
    } catch (err) {
      if (err instanceof TokenExpiredError) {
        throw new ExpiredTokenError("[FakeTokenService] expired error wrapped")
      }
      if (
        (err instanceof JsonWebTokenError || err instanceof NotBeforeError) &&
        err instanceof TokenExpiredError === false
      ) {
        throw new InvalidTokenError("[FakeTokenService] invalid and not before errors wrapped")
      }
    }
  }

  public static getInvalid(_userId?: string): string {
    const token = FakeTokenService.getValid()
    const invalidToken = token.substring(0, token.length - 3)
    return invalidToken
  }
}
