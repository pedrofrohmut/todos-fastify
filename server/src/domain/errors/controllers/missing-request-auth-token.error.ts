export default class MissingRequestAuthTokenError extends Error {
  public static message = "Request auth token is null"

  public constructor(message?: string) {
    if (message) {
      super(MissingRequestAuthTokenError.message + ". " + message)
    } else {
      super(MissingRequestAuthTokenError.message)
    }
  }
}
