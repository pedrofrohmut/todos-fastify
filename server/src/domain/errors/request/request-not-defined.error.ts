export default class RequestNotDefinedError extends Error {
  public static message = "Request is null or not defined"

  public constructor(message?: string) {
    if (message) {
      super(RequestNotDefinedError.message + ". " + message)
    } else {
      super(RequestNotDefinedError.message)
    }
  }
}
