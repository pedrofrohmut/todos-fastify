import UserValidator from "../../../../../src/domain/validators/user-validator.interface";
import {isValidUUIDv4} from "../../../functions/validation.functions";

export class MockUserValidator implements UserValidator {
  public getMessageForId(id?: string): string {
    if (!id) {
      return "MOCK: NO ID"
    }
    if (!isValidUUIDv4(id)) {
      return "MOCK: NO VALID UUIDv4"
    }
    return null
  }
}
