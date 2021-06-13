export default class InvalidRequestTokenError extends Error {
  public static message = "Request authentication token is not a valid string"

  public constructor(message?: string) {
    if (message) {
      super(InvalidRequestTokenError.message + ". " + message)
    } else {
      super(InvalidRequestTokenError.message)
    }
  }
}
