import DatabaseConnection from "../../../database/database-connection.interface"
import { CreateUserDto } from "../../../types/user.types"

import CreateUserService from "../create-user-service.interface"

export default class PostgresCreateUserService implements CreateUserService {
  private readonly connection: DatabaseConnection

  constructor(connection: DatabaseConnection) {
    this.connection = connection
  }

  public async execute({ name, email, passwordHash }: CreateUserDto): Promise<void> {
    this.connection.mutate(
      "INSERT INTO app.users (name, email, password_hash) VALUES ($1, $2, $3)",
      [name, email, passwordHash]
    )
  }
}
