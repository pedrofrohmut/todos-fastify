import "jest-extended"

import { ClientConfig } from "pg"

import ConnectionFactory from "../../../../src/domain/factories/connection-factory.interface"

import PostgresConnectionFactory from "../../../../src/domain/factories/implementations/postgres-connection.factory"
import PostgresDatabaseConnection from "../../../../src/domain/database/implementations/postgres.database-connection"

import InvalidConnectionConfigurationError from "../../../../src/domain/errors/database/invalid-connection-configuration.error"

import { getSyncError } from "../../../utils/functions/error.functions"
import { expectsToHaveError } from "../../../utils/functions/expects.functions"

const getConstructorError = (factory: any, config: any): null | Error => {
  const possibleErr = getSyncError(() => {
    new factory(config).getConnection()
  })
  return possibleErr
}

let config: ClientConfig

beforeEach(() => {
  config = {
    user: process.env.PGUSER,
    password: process.env.PGPASSWORD,
    host: process.env.PGHOST,
    port: parseInt(process.env.PGPORT),
    database: process.env.PGDATABASE
  }
})

describe("PostgreConnectionFactory | Constructor | Defined but invalid config throws error", () => {
  test("Falsy user", () => {
    config.user = null
    // Given
    expect(config.user).toBeFalsy()
    // When
    const constructorErr = getConstructorError(PostgresConnectionFactory, config)
    // Then
    expectsToHaveError(constructorErr)
    expect(constructorErr).toBeInstanceOf(InvalidConnectionConfigurationError)
  })

  test("Not String user", () => {
    // @ts-ignore
    config.user = 123
    // Given
    expect(config.user).not.toBeString()
    // When
    const constructorErr = getConstructorError(PostgresConnectionFactory, config)
    // Then
    expectsToHaveError(constructorErr)
    expect(constructorErr).toBeInstanceOf(InvalidConnectionConfigurationError)
  })

  test("Falsy password", () => {
    config.password = null
    // Given
    expect(config.password).toBeFalsy()
    // When
    const constructorErr = getConstructorError(PostgresConnectionFactory, config)
    // Then
    expectsToHaveError(constructorErr)
    expect(constructorErr).toBeInstanceOf(InvalidConnectionConfigurationError)
  })

  test("Not string password", () => {
    // @ts-ignore
    config.password = 123
    // Given
    expect(config.password).not.toBeString()
    // When
    const constructorErr = getConstructorError(PostgresConnectionFactory, config)
    // Then
    expectsToHaveError(constructorErr)
    expect(constructorErr).toBeInstanceOf(InvalidConnectionConfigurationError)
  })

  test("Falsy host", () => {
    config.host = null
    // Given
    expect(config.host).toBeFalsy()
    // When
    const constructorErr = getConstructorError(PostgresConnectionFactory, config)
    // Then
    expectsToHaveError(constructorErr)
    expect(constructorErr).toBeInstanceOf(InvalidConnectionConfigurationError)
  })

  test("Not string host", () => {
    // @ts-ignore
    config.host = 123
    // Given
    expect(config.host).not.toBeString()
    // When
    const constructorErr = getConstructorError(PostgresConnectionFactory, config)
    // Then
    expectsToHaveError(constructorErr)
    expect(constructorErr).toBeInstanceOf(InvalidConnectionConfigurationError)
  })

  test("Falsy port", () => {
    config.port = null
    // Given
    expect(config.port).toBeFalsy()
    // When
    const constructorErr = getConstructorError(PostgresConnectionFactory, config)
    // Then
    expectsToHaveError(constructorErr)
    expect(constructorErr).toBeInstanceOf(InvalidConnectionConfigurationError)
  })

  test("Not typeof string or number port", () => {
    // @ts-ignore
    config.port = { foo: "bar" }
    // Given
    expect(config.port).not.toBeNumber()
    expect(config.port).not.toBeString()
    // When
    const constructorErr = getConstructorError(PostgresConnectionFactory, config)
    // Then
    expectsToHaveError(constructorErr)
    expect(constructorErr).toBeInstanceOf(InvalidConnectionConfigurationError)
  })

  test("Cant be parsed to number port", () => {
    // @ts-ignore
    config.port = "foo"
    // Given
    expect(config.port).toBeString()
    expect(config.port).toBeNaN()
    // When
    const constructorErr = getConstructorError(PostgresConnectionFactory, config)
    // Then
    expectsToHaveError(constructorErr)
    expect(constructorErr).toBeInstanceOf(InvalidConnectionConfigurationError)
  })

  test("Falsy database", () => {
    config.database = null
    // Given
    expect(config.database).toBeFalsy()
    // When
    const constructorErr = getConstructorError(PostgresConnectionFactory, config)
    // Then
    expectsToHaveError(constructorErr)
    expect(constructorErr).toBeInstanceOf(InvalidConnectionConfigurationError)
  })

  test("Not string database", () => {
    // @ts-ignore
    config.database = 123
    // Given
    expect(config.database).not.toBeString()
    // When
    const constructorErr = getConstructorError(PostgresConnectionFactory, config)
    // Then
    expectsToHaveError(constructorErr)
    expect(constructorErr).toBeInstanceOf(InvalidConnectionConfigurationError)
  })
})

describe("PostgreConnectionFactory | getConnection | is a valid connection", () => {
  let connectionFactory: ConnectionFactory

  beforeEach(() => {
    connectionFactory = new PostgresConnectionFactory(config)
  })

  test("Falsy config throws no errors", () => {
    config = null
    // Given
    expect(config).toBeFalsy()
    // When
    const constructorErr = getSyncError(() => new PostgresConnectionFactory(config))
    // Then
    expect(constructorErr).toBeFalsy()
  })

  test("Typeof of object with open and close methods", () => {
    // Given
    expect(connectionFactory).toBeTruthy()
    expect(connectionFactory).toBeObject()
    expect(connectionFactory.getConnection).toBeDefined()
    // When
    const connection = connectionFactory.getConnection()
    // Then
    expect(connection).toBeTruthy()
    expect(connection).toBeInstanceOf(PostgresDatabaseConnection)
    expect(connection.open).toBeDefined()
    expect(connection.close).toBeDefined()
  })
})
