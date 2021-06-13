import DatabaseConnection from "../database/database-connection.interface"

export default interface ConnectionFactory {
  getConnection(): DatabaseConnection
}
