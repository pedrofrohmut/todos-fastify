import DatabaseConnection from "../../../database/database-connection.interface"
import { UserDto, UserTableDto } from "../../../types/user.types"

import FindUserByIdService from "../find-user-by-id-service.interface"

export default class PostgresFindUserByIdService implements FindUserByIdService {
  constructor(private readonly connection: DatabaseConnection) {}

  private getQueryResultRows(userId: string) {
    return this.connection.query<UserTableDto>(
      "SELECT name, email, password_hash FROM app.users WHERE id = $1",
      [userId]
    )
  }

  private mapFirstRowToTask(userId: string, rows: UserTableDto[]) {
    const { name, email, password_hash } = rows[0]
    return {
      id: userId,
      name,
      email,
      passwordHash: password_hash
    }
  }

  public async execute(userId: string): Promise<UserDto | null> {
    const rows = await this.getQueryResultRows(userId)
    if (rows.length === 0) {
      return null
    }
    const user = this.mapFirstRowToTask(userId, rows)
    return user
  }
}
