import { Client } from "pg"

import DatabaseConnection from "../database/database-connection.interface"

import PostgresDatabaseConnection from "../database/postgres.database-connection"

import DataBaseConnectionError from "../errors/database/connection.error"

export default class ConnectionFactory {
  public static getConnection(): DatabaseConnection {
    try {
      const client = new Client()
      return new PostgresDatabaseConnection(client)
    } catch (err) {
      throw new DataBaseConnectionError(err.message)
    }
  }
}