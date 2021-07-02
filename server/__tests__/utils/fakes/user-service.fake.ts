import { v4 as uuid } from "uuid"

export default class FakeUserService {
  public static getUserFromService(userDB: {
    id: string
    name: string
    email: string
    password_hash: string
  }) {
    return {
      id: userDB.id,
      name: userDB.name,
      email: userDB.email,
      passwordHash: userDB.password_hash
    }
  }

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
