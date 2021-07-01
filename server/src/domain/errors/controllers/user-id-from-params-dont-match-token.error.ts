export default class UserIdFromParamsDontMatchTokenError extends Error {
  public static message =
    "UserId from request params do not match the userId from the request authToken"

  public constructor(message?: string) {
    if (message) {
      super(UserIdFromParamsDontMatchTokenError.message + ". " + message)
    } else {
      super(UserIdFromParamsDontMatchTokenError.message)
    }
  }
}
