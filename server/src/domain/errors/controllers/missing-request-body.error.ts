export default class MissingRequestBodyError extends Error {
  public static message = "Request body is null"

  public constructor(message?: string) {
    if (message) {
      super(MissingRequestBodyError.message + ". " + message)
    } else {
      super(MissingRequestBodyError.message)
    }
  }
}
