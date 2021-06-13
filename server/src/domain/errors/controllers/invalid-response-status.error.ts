export default class InvalidResponseStatusError extends Error {
  public static message = "Controller response status is not a valid number"

  public constructor(message?: string) {
    if (message) {
      super(InvalidResponseStatusError.message + ". " + message)
    } else {
      super(InvalidResponseStatusError.message)
    }
  }
}
