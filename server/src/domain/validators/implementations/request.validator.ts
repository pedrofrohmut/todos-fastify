// import RequestValidator from "../request-validator.interface"
// import TokenValidator from "../token-validator.interface"

// import MissingRequestHeadersError from "../../errors/controllers/missing-request-headers.error"
// import MissingRequestTokenError from "../../errors/controllers/missing-request-token.error"

// export default class RequestValidatorImplementation implements RequestValidator {
// private readonly tokenValidator: TokenValidator

// constructor(tokenValidator: TokenValidator) {
//   this.tokenValidator = tokenValidator
// }

// public isValidRequest(request?: any): boolean {
//   if (!request || typeof request !== "object") {
//     return false
//   }
//   return true
// }

// public getMessageForAuthenticationHeaders(headers?: any): string | null {
//   if (!headers) {
//     return new MissingRequestHeadersError("[CreateTaskController] Required request headers")
//       .message
//   }
//   if (!headers.authenticationToken) {
//     return new MissingRequestTokenError(
//       "[CreateTaskController] Required request authenticationToken"
//     ).message
//   }
//   const tokenValidationMessage = this.tokenValidator.getMessageForToken(headers.authenticationToken)
//   if (tokenValidationMessage !== null) {
//     return tokenValidationMessage
//   }
//   return null
// }
// }

import InvalidRequestHeadersError from "../../errors/controllers/invalid-request-headers.error"
import MissingRequestHeadersError from "../../errors/controllers/missing-request-headers.error"
import MissingRequestTokenError from "../../errors/controllers/missing-request-token.error"
import ValidatorDependencyError from "../../errors/dependencies/validator-dependency.error"
import RequestValidator from "../request-validator.interface"
import TokenValidator from "../token-validator.interface"

export default class RequestValidatorImplementation implements RequestValidator {
  private readonly tokenValidator: TokenValidator

  constructor(tokenValidator: TokenValidator) {
    this.tokenValidator = tokenValidator
  }

  public isValidRequest(request?: any): boolean {
    if (request === null || request === undefined || typeof request !== "object") {
      return false
    }
    const haveBody = Object.keys(request).some(key => key === "body")
    const haveHeaders = Object.keys(request).some(key => key === "headers")
    const haveParams = Object.keys(request).some(key => key === "params")
    if (!haveBody || !haveHeaders || !haveParams) {
      return false
    }
    return true
  }

  public getMessageForAuthenticationHeaders(headers?: any): string | null {
    if (!this.tokenValidator) {
      throw new ValidatorDependencyError("[RequestValidator] token validator")
    }
    if (headers === null || headers === undefined) {
      return new MissingRequestHeadersError(
        "[RequestValidator] get message for authentication headers"
      ).message
    }
    if (typeof headers !== "object") {
      return new InvalidRequestHeadersError(
        "[RequestValidator] get message for authentication headers"
      ).message
    }
    const token = headers.authenticationToken
    if (!token) {
      return new MissingRequestTokenError(
        "[RequestValidator] get message for authentication headers"
      ).message
    }
    const tokenValidationMessage = this.tokenValidator.getMessageForToken(token)
    if (tokenValidationMessage !== null) {
      return tokenValidationMessage
    }
    return null
  }
}
