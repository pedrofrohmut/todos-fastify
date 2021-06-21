export default class EmailAlreadyRegisteredError extends Error {
  public static message = "User e-mail is already registered"

  public constructor(message?: string) {
    if (message) {
      super(EmailAlreadyRegisteredError.message + ". " + message)
    } else {
      super(EmailAlreadyRegisteredError.message)
    }
  }
}
