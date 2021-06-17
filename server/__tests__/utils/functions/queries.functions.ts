import DatabaseConnection from "../../../src/domain/database/database-connection.interface"
import { UserTable } from "../../../src/domain/types/user.types"

export const createUserQuery = async (
  connection: DatabaseConnection,
  { id, name, email, password_hash }: UserTable
) => {
  await connection.query(
    "INSERT INTO app.users (id, name, email, password_hash) VALUES ($1, $2, $3,$4)",
    [id, name, email, password_hash]
  )
}

export const findUserByIdQuery = async (connection: DatabaseConnection, id: string) => {
  const rows = await connection.query<UserTable>("SELECT * FROM app.users WHERE id = $1", [id])
  return rows[0] || null
}
