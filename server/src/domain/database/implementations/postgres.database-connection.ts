import { Client } from "pg"

import DatabaseConnection from "./database-connection.interface"

import DataBaseConnectionError from "../errors/database/connection.error"

export default class PostgresDatabaseConnection implements DatabaseConnection {
  private readonly connection: Client

  public constructor(connection: Client) {
    this.connection = connection
  }

  public async open(): Promise<void> {
    try {
      await this.connection.connect()
    } catch (err) {
      throw new DataBaseConnectionError(err.message)
    }
  }

  public async close(): Promise<void> {
    try {
      await this.connection.end()
    } catch (err) {
      throw new DataBaseConnectionError(err.message)
    }
  }
}
