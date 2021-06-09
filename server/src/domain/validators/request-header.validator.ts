import { AdaptedRequestHeaders } from "../../utils/types/controller/util.types"

import TokenValidator from "./token.validator"

import MissingRequestHeadersError from "../errors/controllers/missing-request-headers.error"
import MissingRequestTokenError from "../errors/controllers/missing-request-token.error"

export default class RequestHeadersValdator {
  public static getMessageForAuthentication(headers?: AdaptedRequestHeaders): string | null {
    if (!headers) {
      return new MissingRequestHeadersError("[CreateTaskController] Required request headers")
        .message
    }
    if (!headers.authenticationToken) {
      return new MissingRequestTokenError(
        "[CreateTaskController] Required request authenticationToken"
      ).message
    }
    const tokenValidationMessage = TokenValidator.getMessageForToken(headers.authenticationToken)
    if (tokenValidationMessage !== null) {
      return tokenValidationMessage
    }
    return null
  }
}
