export default class UserNotFoundByEmailError extends Error {
  public static message = "User was not found with the user email passed"

  public constructor(message?: string) {
    if (message) {
      super(UserNotFoundByEmailError.message + ". " + message)
    } else {
      super(UserNotFoundByEmailError.message)
    }
  }
}
