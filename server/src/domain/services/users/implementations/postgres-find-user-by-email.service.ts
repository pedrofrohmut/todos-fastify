import DatabaseConnection from "../../../database/database-connection.interface"
import { UserDto, UserTableDto } from "../../../types/user.types"

import FindUserByEmailService from "../find-user-by-email-service.interface"

export default class PostgresFindUserByEmailService implements FindUserByEmailService {
  constructor(private readonly connection: DatabaseConnection) {}

  private getQueryResultRows(email: string) {
    return this.connection.query<UserTableDto>(
      "SELECT id, name, password_hash FROM app.users WHERE email = $1",
      [email]
    )
  }

  private mapFirstRowToTask(email: string, rows: UserTableDto[]) {
    const { id, name, password_hash } = rows[0]
    return {
      id,
      name,
      email,
      passwordHash: password_hash
    }
  }

  public async execute(email: string): Promise<UserDto | null> {
    const rows = await this.getQueryResultRows(email)
    if (rows.length === 0) {
      return null
    }
    const user = this.mapFirstRowToTask(email, rows)
    return user
  }
}
