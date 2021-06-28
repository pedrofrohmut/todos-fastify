export default class MissingRequestParamsError extends Error {
  public static message = "Request params is null"

  public constructor(message?: string) {
    if (message) {
      super(MissingRequestParamsError.message + ". " + message)
    } else {
      super(MissingRequestParamsError.message)
    }
  }
}
