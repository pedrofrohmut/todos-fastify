import { v4 } from "uuid"

export default class FakeUserService {
  public static getValidUserId(): string {
    return v4()
  }
}
