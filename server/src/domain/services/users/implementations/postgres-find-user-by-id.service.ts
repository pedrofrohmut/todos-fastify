import DatabaseConnection from "../../../database/database-connection.interface"
import { UserDto, UserTableDto } from "../../../types/user.types"

import FindUserByIdService from "../find-user-by-id-service.interface"

export default class PostgresFindUserByIdService implements FindUserByIdService {
  private readonly connection: DatabaseConnection

  constructor(connection: DatabaseConnection) {
    this.connection = connection
  }

  public async execute(userId: string): Promise<UserDto | null> {
    const queryResultRows = await this.connection.query<UserTableDto>(
      "SELECT name, email, password_hash FROM app.users WHERE id = $1",
      [userId]
    )
    if (queryResultRows.length === 0) {
      return null
    }
    const { name, email, password_hash } = queryResultRows[0]
    return {
      id: userId,
      name,
      email,
      passwordHash: password_hash
    }
  }
}
