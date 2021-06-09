export default class ServerMissingJWTSecretError extends Error {
  public static message = "Server is missing the the JWT Secret necessary to for JWT Lib to work"

  public constructor(message?: string) {
    if (message) {
      super(ServerMissingJWTSecretError.message + ". " + message)
    } else {
      super(ServerMissingJWTSecretError.message)
    }
  }
}
