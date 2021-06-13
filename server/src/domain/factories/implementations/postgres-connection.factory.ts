import { Client } from "pg"

import ConnectionFactory from "../connection-factory.interface"
import DatabaseConnection from "../../database/database-connection.interface"

import PostgresDatabaseConnection from "../../database/postgres.database-connection"

import DataBaseConnectionError from "../../errors/database/connection.error"

export default class PostgresConnectionFactory implements ConnectionFactory {
  public getConnection(): DatabaseConnection {
    try {
      const client = new Client()
      return new PostgresDatabaseConnection(client)
    } catch (err) {
      throw new DataBaseConnectionError(err.message)
    }
  }
}
