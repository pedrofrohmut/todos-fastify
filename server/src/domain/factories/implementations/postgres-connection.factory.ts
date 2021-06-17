import { Client, ClientConfig } from "pg"

import ConnectionFactory from "../connection-factory.interface"
import DatabaseConnection from "../../database/database-connection.interface"

import PostgresDatabaseConnection from "../../database/implementations/postgres.database-connection"

import DataBaseConnectionError from "../../errors/database/connection.error"
import InvalidConnectionConfigurationError from "../../errors/database/invalid-connection-configuration.error"

export default class PostgresConnectionFactory implements ConnectionFactory {
  private readonly configuration: ClientConfig | undefined

  constructor(configuration?: ClientConfig) {
    if (configuration) {
      this.validateConfiguration(configuration)
      this.configuration = configuration
    }
  }

  private validateConfiguration(configuration: any): void {
    if (
      !configuration.user ||
      typeof configuration.user !== "string" ||
      !configuration.password ||
      typeof configuration.password !== "string" ||
      !configuration.host ||
      typeof configuration.host !== "string" ||
      !configuration.port ||
      (typeof configuration.port !== "number" && typeof configuration.port !== "string") ||
      (typeof configuration.port === "string" && isNaN(configuration.port)) ||
      !configuration.database ||
      typeof configuration.database !== "string"
    ) {
      throw new InvalidConnectionConfigurationError("[PostgresConnectionFactory] constructor")
    }
  }

  public getConnection(): DatabaseConnection {
    try {
      const postgresClient = new Client(this.configuration)
      return new PostgresDatabaseConnection(postgresClient)
    } catch (err) {
      throw new DataBaseConnectionError("[PostgresConnectionFactory] getConnection. " + err.message)
    }
  }
}
