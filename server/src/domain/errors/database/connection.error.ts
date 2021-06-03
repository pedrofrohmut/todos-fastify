export default class DataBaseConnectionError extends Error {
  public static message = "Could not connect to database"

  public constructor(message?: string) {
    if (message) {
      super(DataBaseConnectionError.message + ": " + message)
    } else {
      super(DataBaseConnectionError.message)
    }
  }
}
