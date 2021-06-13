export default class MissingControllerResponseError extends Error {
  public static message =
    "Controller is missing a response. And it should always return one if not unexpected errors occur"

  public constructor(message?: string) {
    if (message) {
      super(MissingControllerResponseError.message + ". " + message)
    } else {
      super(MissingControllerResponseError.message)
    }
  }
}
