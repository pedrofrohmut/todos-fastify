import { Client } from "pg"

import DatabaseConnection from "../database-connection.interface"

import DataBaseConnectionError from "../../errors/database/connection.error"
import DependencyInjectionError from "../../errors/dependencies/dependency-injection.error"

export default class PostgresDatabaseConnection implements DatabaseConnection {
  private readonly connection: Client

  public constructor(connection: Client) {
    this.connection = connection
  }

  private validateTheConnection() {
    if (!this.connection) {
      throw new DependencyInjectionError("[PostgresDatabaseConnection] open")
    }
  }

  public async open(): Promise<void> {
    this.validateTheConnection()
    try {
      await this.connection.connect()
    } catch (err) {
      throw new DataBaseConnectionError("[PostgresDatabaseConnection] open. " + err.message)
    }
  }

  public async close(): Promise<void> {
    this.validateTheConnection()
    try {
      await this.connection.end()
    } catch (err) {
      throw new DataBaseConnectionError("[PostgresDatabaseConnection] close. " + err.message)
    }
  }
}
