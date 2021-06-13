export default class InvalidRequestParamsError extends Error {
  public static message = "Request params is invalid"

  public constructor(message?: string) {
    if (message) {
      super(InvalidRequestParamsError.message + ". " + message)
    } else {
      super(InvalidRequestParamsError.message)
    }
  }
}
