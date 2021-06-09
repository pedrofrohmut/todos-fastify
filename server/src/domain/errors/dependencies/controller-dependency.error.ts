export default class ControllerDependencyError extends Error {
  public static message =
    "Could not construct a controller. Injected dependencies are invalid or not defined"

  public constructor(message?: string) {
    if (message) {
      super(ControllerDependencyError.message + ". " + message)
    } else {
      super(ControllerDependencyError.message)
    }
  }
}
