export default class DataBaseConnectionError extends Error {
  public static message = "Error with the database connection"

  public constructor(message?: string) {
    if (message) {
      super(DataBaseConnectionError.message + ". " + message)
    } else {
      super(DataBaseConnectionError.message)
    }
  }
}
