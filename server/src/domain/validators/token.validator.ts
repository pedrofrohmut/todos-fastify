import DecoderTokenUtil from "../../utils/services/decoder-token.util"
import ExpiredTokenError from "../errors/auth/expired-token.error"
import InvalidTokenError from "../errors/auth/invalid-token.error"

export default class TokenValidator {
  public static getMessageForToken(token?: string): string | null {
    try {
      DecoderTokenUtil.decode(token)
      return null
    } catch (err) {
      if (err instanceof ExpiredTokenError) {
        return new ExpiredTokenError("[TokenValidator] Token expired").message
      }
      if (err instanceof InvalidTokenError) {
        return new InvalidTokenError("[TokenValidator] Token is invalid").message
      }
      return err.message
    }
  }
}
