import { Client } from "pg"

import DatabaseConnection from "../database-connection.interface"

import DataBaseConnectionError from "../../errors/database/connection.error"

export default class PostgresDatabaseConnection implements DatabaseConnection {
  private readonly connection: Client

  public constructor(connection: Client) {
    this.connection = connection
  }

  public async query<T>(queryString: string, queryArguments: any[]): Promise<T[]> {
    try {
      const { rows } = await this.connection.query<T>(queryString, queryArguments)
      return rows
    } catch (err) {
      throw new DataBaseConnectionError("[PostgresDatabaseConnection] query. " + err.message)
    }
  }

  public async open(): Promise<void> {
    try {
      await this.connection.connect()
    } catch (err) {
      throw new DataBaseConnectionError("[PostgresDatabaseConnection] open. " + err.message)
    }
  }

  public async close(): Promise<void> {
    try {
      await this.connection.end()
    } catch (err) {
      throw new DataBaseConnectionError("[PostgresDatabaseConnection] close. " + err.message)
    }
  }
}
