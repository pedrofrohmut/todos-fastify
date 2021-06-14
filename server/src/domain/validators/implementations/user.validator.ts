import UserValidator from "../user-validator.interface"

const UUID_V4_REGEX = /^[0-9A-F]{8}-[0-9A-F]{4}-4[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i

export default class UserValidatorImplementation implements UserValidator {
  public getMessageForId(id?: string): string | null {
    if (id === null || id === undefined) {
      return "User id is required"
    }
    if (typeof id !== "string") {
      return "User id must be a valid string"
    }
    if (!UUID_V4_REGEX.test(id)) {
      return "User id must be a valid uuid v4"
    }
    return null
  }
}
