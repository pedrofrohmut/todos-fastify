export default class InvalidRequestError extends Error {
  public static message = "Request is not a valid object"

  public constructor(message?: string) {
    if (message) {
      super(InvalidRequestError.message + ". " + message)
    } else {
      super(InvalidRequestError.message)
    }
  }
}
