export default class TaskValidator {
  public static getMessageForName(name?: string): string | null {
    return !name ? "The task name is required" : null
  }
  public static getMessageForDescription(description?: string): string | null {
    return null
  }
}
