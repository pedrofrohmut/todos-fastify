export default class MissingRequestTokenError extends Error {
  public static message = "Request headers authenticationToken is null or undefined"

  public constructor(message?: string) {
    if (message) {
      super(MissingRequestTokenError.message + ". " + message)
    } else {
      super(MissingRequestTokenError.message)
    }
  }
}
