export default class EmailAlreadyRegisteredError extends Error {
  public static message = "User was not found with the userId passed"

  public constructor(message?: string) {
    if (message) {
      super(EmailAlreadyRegisteredError.message + ". " + message)
    } else {
      super(EmailAlreadyRegisteredError.message)
    }
  }
}
