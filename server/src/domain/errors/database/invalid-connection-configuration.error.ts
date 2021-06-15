export default class InvalidConnectionConfigurationError extends Error {
  public static message =
    "The connection configuration is invalid. There are missing fields or invalid values for them"

  public constructor(message?: string) {
    if (message) {
      super(InvalidConnectionConfigurationError.message + ". " + message)
    } else {
      super(InvalidConnectionConfigurationError.message)
    }
  }
}
