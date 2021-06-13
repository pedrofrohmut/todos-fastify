export default class InvalidResponseBodyError extends Error {
  public static message = "Controller response body is invalid"

  public constructor(message?: string) {
    if (message) {
      super(InvalidResponseBodyError.message + ". " + message)
    } else {
      super(InvalidResponseBodyError.message)
    }
  }
}
