export default class PasswordAndHashDontMatchError extends Error {
  public static message = "Password and the hashed passed do no match"

  public constructor(message?: string) {
    if (message) {
      super(PasswordAndHashDontMatchError.message + ". " + message)
    } else {
      super(PasswordAndHashDontMatchError.message)
    }
  }
}
