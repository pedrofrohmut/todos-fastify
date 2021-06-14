export default class InvalidTokenUserIdError extends Error {
  public static message = "User id in authentication token is not a valid uuid v4"

  public constructor(message?: string) {
    if (message) {
      super(InvalidTokenUserIdError.message + ". " + message)
    } else {
      super(InvalidTokenUserIdError.message)
    }
  }
}
