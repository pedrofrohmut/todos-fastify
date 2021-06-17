import { User } from "../../../../../../src/domain/types/user.types"

import FindUserByIdService from "../../../../../../src/domain/services/users/find-user-by-id-service.interface"

export class MockFindUserByIdService implements FindUserByIdService {
  public async execute(userId: string): Promise<User> {
    if (!userId) {
      return null
    }
    return {
      id: userId,
      name: "user name",
      email: "user@email.com",
      passwordHash: "passwordHash"
    }
  }
}
