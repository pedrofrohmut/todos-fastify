export default class InvalidResponseError extends Error {
  public static message = "Controller response is not a valid object"

  public constructor(message?: string) {
    if (message) {
      super(InvalidResponseError.message + ". " + message)
    } else {
      super(InvalidResponseError.message)
    }
  }
}
