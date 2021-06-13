export default class InvalidRequestBodyError extends Error {
  public static message = "Request body is invalid"

  public constructor(message?: string) {
    if (message) {
      super(InvalidRequestBodyError.message + ". " + message)
    } else {
      super(InvalidRequestBodyError.message)
    }
  }
}
