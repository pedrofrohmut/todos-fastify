import isUUID from "validator/lib/isUUID"

import TaskValidator from "../task-validator.interface"

export default class TaskValidatorImplementation implements TaskValidator {
  public getMessageForId(id?: string): string | null {
    if (id === null || id === undefined) {
      return "Task id is required"
    }
    if (typeof id !== "string") {
      return "Task id is not a valid string"
    }
    if (!isUUID(id, 4)) {
      return "Task id is not a valid UUID v4"
    }
    return null
  }

  public getMessageForName(name?: string): null | string {
    if (name === null || name === undefined) {
      return "Task name is required"
    }
    if (typeof name !== "string") {
      return "Task name must be a valid string"
    }
    if (name.length <= 2 || name.length >= 120) {
      return "Task name must be greater than 2 and less than 120 characters"
    }
    return null
  }

  public getMessageForDescription(description?: string): null | string {
    if (description && description.length > 255) {
      return "Task description is too long. Must be less than 255 characters"
    }
    if (description && typeof description !== "string") {
      return "Task description must be a valid string"
    }
    return null
  }
}
