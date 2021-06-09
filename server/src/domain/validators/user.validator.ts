export default class UserValidator {
  public static getMessageForId(id?: string): string | null {
    return !id ? "The userId is requires" : null
  }
}
