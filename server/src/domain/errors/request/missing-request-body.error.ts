export default class MissingRequestBodyError extends Error {
  public static message = "The request body is missing. But it is required"

  constructor(msg?: string) {
    if (msg) {
      super(MissingRequestBodyError.message + ". " + msg)
    } else {
      super(MissingRequestBodyError.message)
    }
  }
}
