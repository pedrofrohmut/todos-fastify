export default class MissingRequestHeadersError extends Error {
  public static message = "Request headers are null or undefined"

  public constructor(message?: string) {
    if (message) {
      super(MissingRequestHeadersError.message + ". " + message)
    } else {
      super(MissingRequestHeadersError.message)
    }
  }
}
