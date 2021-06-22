import isUUID from "validator/lib/isUUID"
import isEmail from "validator/lib/isEmail"

import UserValidator from "../user-validator.interface"

export default class UserValidatorImplementation implements UserValidator {
  public getMessageForName(name?: string): string | null {
    if (name === null || name === undefined) {
      return "User name is required"
    }
    if (typeof name !== "string") {
      return "User name is not a valid string"
    }
    if (name.length < 3) {
      return "User name is too short. Min of 3 characters"
    }
    if (name.length > 120) {
      return "User name is too long. Max os 120 characters"
    }
    return null
  }

  public getMessageForEmail(email?: string): string | null {
    if (email === null || email === undefined) {
      return "User email is required"
    }
    if (typeof email !== "string") {
      return "User email is not a valid string"
    }
    if (!isEmail(email)) {
      return "User email is not a valid email format"
    }
    return null
  }

  public getMessageForPassword(password?: string): string | null {
    if (password === null || password === undefined) {
      return "User password is required"
    }
    if (typeof password !== "string") {
      return "User password is not a valid string"
    }
    if (password.length < 3) {
      return "User password is too short. Min of 3"
    }
    if (password.length > 32) {
      return "User password is too long. Max of 32"
    }
    return null
  }

  public getMessageForId(id?: string): string | null {
    if (id === null || id === undefined) {
      return "User id is required"
    }
    if (typeof id !== "string") {
      return "User id must be a valid string"
    }
    if (!isUUID(id, 4)) {
      return "User id must be a valid uuid v4"
    }
    return null
  }
}
