export default class ControllerNotListedInFactoryError extends Error {
  public static message = "Controller is not listed in the factory"

  public constructor(message?: string) {
    if (message) {
      super(ControllerNotListedInFactoryError.message + ". " + message)
    } else {
      super(ControllerNotListedInFactoryError.message)
    }
  }
}
