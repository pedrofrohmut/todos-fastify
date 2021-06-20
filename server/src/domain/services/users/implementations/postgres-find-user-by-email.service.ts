import DatabaseConnection from "../../../database/database-connection.interface"
import { User, UserTable } from "../../../types/user.types"

import FindUserByEmailService from "../find-user-by-email-service.test"

export default class PostgresFindUserByEmailService implements FindUserByEmailService {
  private readonly connection: DatabaseConnection

  constructor(connection: DatabaseConnection) {
    this.connection = connection
  }

  public async execute(email: string): Promise<User | null> {
    const queryResultRows = await this.connection.query<UserTable>(
      "SELECT id, name, password_hash FROM app.users WHERE email = $1",
      [email]
    )
    if (queryResultRows.length === 0) {
      return null
    }
    const { id, name, password_hash } = queryResultRows[0]
    return {
      id,
      name,
      email,
      passwordHash: password_hash
    }
  }
}
