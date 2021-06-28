export default class TaskNotFoundByIdError extends Error {
  public static message = "Task not found with the taskId passed"

  public constructor(message?: string) {
    if (message) {
      super(TaskNotFoundByIdError.message + ". " + message)
    } else {
      super(TaskNotFoundByIdError.message)
    }
  }
}
