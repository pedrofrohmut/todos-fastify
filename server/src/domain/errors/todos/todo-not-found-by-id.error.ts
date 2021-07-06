export default class TodoNotFoundByIdError extends Error {
  public static message = "Todo not found with the todoId passed"

  public constructor(message?: string) {
    if (message) {
      super(TodoNotFoundByIdError.message + ". " + message)
    } else {
      super(TodoNotFoundByIdError.message)
    }
  }
}
