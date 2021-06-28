export default class UserNotFoundByIdError extends Error {
  public static message = "User not found with the userId passed"

  public constructor(message?: string) {
    if (message) {
      super(UserNotFoundByIdError.message + ". " + message)
    } else {
      super(UserNotFoundByIdError.message)
    }
  }
}
