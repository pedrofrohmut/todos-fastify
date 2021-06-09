export default class InvalidTokenError extends Error {
  public static message = "Request headers authenticationToken is invalid and cant be parsed"

  public constructor(message?: string) {
    if (message) {
      super(InvalidTokenError.message + ". " + message)
    } else {
      super(InvalidTokenError.message)
    }
  }
}
