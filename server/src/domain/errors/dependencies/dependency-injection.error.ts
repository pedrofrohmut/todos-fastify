export default class DependencyInjectionError extends Error {
  public static message =
    "Could not use or construct a class. The dependencies are missing and/or invalid"

  public constructor(message?: string) {
    if (message) {
      super(DependencyInjectionError.message + ". " + message)
    } else {
      super(DependencyInjectionError.message)
    }
  }
}
