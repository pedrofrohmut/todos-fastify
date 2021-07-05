import TodoValidator from "../todo-validator.interface"

export default class TodoValidatorImplementation implements TodoValidator {
  public getMessageForId(id?: string): string | null {}

  public getMessageForName(name?: string): string | null {
    if (name === null || name === undefined) {
      return "Todo name is required"
    }
    if (typeof name !== "string") {
      return "Todo name must be a valid string"
    }
    if (name.length <= 3 || name.length >= 120) {
      return "Todo name must be grater than 2 and less than 120 characters"
    }
    return null
  }

  public getMessageForDescription(description?: string): string | null {
    if (description && description.length > 255) {
      return "Todo description is too long. Must be less than 255 characters"
    }
    if (description && typeof description !== "string") {
      return "Todo description must be a valid string"
    }
    return null
  }
}
