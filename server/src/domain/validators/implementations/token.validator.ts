// import { JsonWebTokenError, NotBeforeError, TokenExpiredError, verify } from "jsonwebtoken"
// import ExpiredTokenError from "../../errors/auth/expired-token.error"
// import InvalidTokenError from "../../errors/auth/invalid-token.error"
// import ServerMissingJWTSecretError from "../../errors/auth/server-missing-jwt-secret.error"

import ExpiredTokenError from "../../errors/auth/expired-token.error"
import InvalidTokenError from "../../errors/auth/invalid-token.error"
import DependencyInjectionError from "../../errors/dependencies/dependency-injection.error"
import TokenDecoderService from "../../services/auth/token-decoder-service.interface"
import TokenValidator from "../token-validator.interface"

// export default class TokenValidatorImplementation implements TokenValidator {
//   private decode(token?: string): null | { userId: string } {
//     if (!token) {
//       return null
//     }
//     if (!process.env.JWT_SECRET) {
//       throw new ServerMissingJWTSecretError("[DecoderTokenUtil] missing JWT Secret in env")
//     }
//     try {
//       const decoded = verify(token, process.env.JWT_SECRET) as { userId: string }
//       return decoded
//     } catch (err) {
//       if (err instanceof TokenExpiredError) {
//         throw new ExpiredTokenError("[DecoderTokenUtil] expired error wrapped")
//       }
//       if (
//         (err instanceof JsonWebTokenError || err instanceof NotBeforeError) &&
//         err instanceof TokenExpiredError === false
//       ) {
//         throw new InvalidTokenError("[DecoderTokenUtil] invalid and not before errors wrapped")
//       }
//       throw err
//     }
//   }

//   public getMessageForToken(token?: any): string | null {
//     try {
//       this.decode(token)
//       return null
//     } catch (err) {
//       if (err instanceof ExpiredTokenError) {
//         return new ExpiredTokenError("[TokenValidator] Token expired").message
//       }
//       if (err instanceof InvalidTokenError) {
//         return new InvalidTokenError("[TokenValidator] Token is invalid").message
//       }
//       return err.message
//     }
//   }
// }
export default class TokenValidatorImplementation implements TokenValidator {
  private readonly tokenDecoderService: TokenDecoderService

  constructor(tokenDecoderService: TokenDecoderService) {
    if (
      tokenDecoderService === null ||
      tokenDecoderService === undefined ||
      tokenDecoderService.execute === undefined
    ) {
      throw new DependencyInjectionError("[TokenValidator] missing decoder service")
    }
    this.tokenDecoderService = tokenDecoderService
  }

  public getMessageForToken(token?: any): string | null {
    if (token === null || token === undefined) {
      return "Token is required"
    }
    if (typeof token !== "string") {
      return "Token must be a valid string"
    }
    try {
      this.tokenDecoderService.execute(token)
      return null
    } catch (err) {
      if (err instanceof ExpiredTokenError) {
        return new ExpiredTokenError("[TokenValidator] get message for token").message
      }
      if (err instanceof InvalidTokenError) {
        return new InvalidTokenError("[TokenValidator] get message for token").message
      }
      throw err
    }
  }
}
