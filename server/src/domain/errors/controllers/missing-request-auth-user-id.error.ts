export default class MissingRequestAuthUserIdError extends Error {
  public static message = "Request auth user id is null"

  public constructor(message?: string) {
    if (message) {
      super(MissingRequestAuthUserIdError.message + ". " + message)
    } else {
      super(MissingRequestAuthUserIdError.message)
    }
  }
}
