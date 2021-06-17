import TaskValidator from "../../../../../src/domain/validators/task-validator.interface";

export class MockTaskValidator implements TaskValidator {
  public getMessageForName(name?: string): string {
    if (!name) {
      return "MOCK: NO NAME"
    }
    if (typeof name !== "string") {
      return "MOCK: INVALID NAME"
    }
    return null
  }
  public getMessageForDescription(description?: string): string {
    if (description.length > 255) {
      return "MOCK: TOO LONG"
    }
    return null
  }
}
