export default class InvalidRequestHeadersError extends Error {
  public static message = "Request headers are not a valid object"

  public constructor(message?: string) {
    if (message) {
      super(InvalidRequestHeadersError.message + ". " + message)
    } else {
      super(InvalidRequestHeadersError.message)
    }
  }
}
