import { v4 as uuid } from "uuid"

export default class FakeUserService {
  public static getValidUserId(): string {
    return uuid()
  }

  public static getUserDB(code: string, userId?: string) {
    return {
      id: userId || uuid(),
      name: "User Name " + code,
      email: "user" + code + "@mail.com",
      password_hash: "user_hash" + code
    }
  }
}
