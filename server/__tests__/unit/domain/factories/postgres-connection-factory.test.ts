import "jest-extended"

import { ClientConfig } from "pg"

import PostgresConnectionFactory from "../../../../src/domain/factories/implementations/postgres-connection.factory"

import InvalidConnectionConfigurationError from "../../../../src/domain/errors/database/invalid-connection-configuration.error"

import { getSyncError } from "../../../utils/functions/error.functions"
import {
  expectsToHaveError,
  expectsValidConnection
} from "../../../utils/functions/expects.functions"

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
    const constructorErr = getSyncError(() => new PostgresConnectionFactory(config))
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
    const constructorErr = getSyncError(() => new PostgresConnectionFactory(config))
    // Then
    expectsToHaveError(constructorErr)
    expect(constructorErr).toBeInstanceOf(InvalidConnectionConfigurationError)
  })

  test("Falsy password", () => {
    config.password = null
    // Given
    expect(config.password).toBeFalsy()
    // When
    const constructorErr = getSyncError(() => new PostgresConnectionFactory(config))
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
    const constructorErr = getSyncError(() => new PostgresConnectionFactory(config))
    // Then
    expectsToHaveError(constructorErr)
    expect(constructorErr).toBeInstanceOf(InvalidConnectionConfigurationError)
  })

  test("Falsy host", () => {
    config.host = null
    // Given
    expect(config.host).toBeFalsy()
    // When
    const constructorErr = getSyncError(() => new PostgresConnectionFactory(config))
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
    const constructorErr = getSyncError(() => new PostgresConnectionFactory(config))
    // Then
    expectsToHaveError(constructorErr)
    expect(constructorErr).toBeInstanceOf(InvalidConnectionConfigurationError)
  })

  test("Falsy port", () => {
    config.port = null
    // Given
    expect(config.port).toBeFalsy()
    // When
    const constructorErr = getSyncError(() => new PostgresConnectionFactory(config))
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
    const constructorErr = getSyncError(() => new PostgresConnectionFactory(config))
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
    const constructorErr = getSyncError(() => new PostgresConnectionFactory(config))
    // Then
    expectsToHaveError(constructorErr)
    expect(constructorErr).toBeInstanceOf(InvalidConnectionConfigurationError)
  })

  test("Falsy database", () => {
    config.database = null
    // Given
    expect(config.database).toBeFalsy()
    // When
    const constructorErr = getSyncError(() => new PostgresConnectionFactory(config))
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
    const constructorErr = getSyncError(() => new PostgresConnectionFactory(config))
    // Then
    expectsToHaveError(constructorErr)
    expect(constructorErr).toBeInstanceOf(InvalidConnectionConfigurationError)
  })
})

describe("PostgreConnectionFactory | getConnection | is a valid connection", () => {
  test("Falsy config throws no errors", () => {
    config = null
    const factory = new PostgresConnectionFactory(config)
    // Given
    expect(config).toBeFalsy()
    // When
    const getConnectionErr = getSyncError(() => factory.getConnection())
    // Then
    expect(getConnectionErr).toBeFalsy()
  })

  test("Truthy config throws no errors", () => {
    const factory = new PostgresConnectionFactory(config)
    // Given
    expect(config).toBeTruthy()
    // When
    const getConnectionErr = getSyncError(() => factory.getConnection())
    // Then
    expect(getConnectionErr).toBeFalsy()
  })

  test("Falsy config returns a valid connection", () => {
    const config = null
    const factory = new PostgresConnectionFactory(config)
    // Given
    expect(config).toBeFalsy()
    // When
    const connection = factory.getConnection()
    // Then
    expectsValidConnection(connection)
  })

  test("Truthy config returns a valid connection", () => {
    const factory = new PostgresConnectionFactory(config)
    // Given
    expect(config).toBeTruthy()
    // When
    const connection = factory.getConnection()
    // Then
    expectsValidConnection(connection)
  })
})
