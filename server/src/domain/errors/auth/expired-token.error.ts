export default class ExpiredTokenError extends Error {
  public static message = "Token is expired"

  public constructor(message?: string) {
    if (message) {
      super(ExpiredTokenError.message + ". " + message)
    } else {
      super(ExpiredTokenError.message)
    }
  }
}
