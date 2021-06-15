import "jest-extended"
import { Client } from "pg"

import DatabaseConnection from "../../../../src/domain/database/database-connection.interface"

import PostgresDatabaseConnection from "../../../../src/domain/database/implementations/postgres.database-connection"
import DataBaseConnectionError from "../../../../src/domain/errors/database/connection.error"

import DependencyInjectionError from "../../../../src/domain/errors/dependencies/dependency-injection.error"

import { getError } from "../../../utils/functions/error.functions"
import { expectsToHaveError } from "../../../utils/functions/expects.functions"

const getOpenError = async (databaseConnection: DatabaseConnection): Promise<null | Error> => {
  const possibleErr = await getError(async () => {
    await databaseConnection.open()
  })
  return possibleErr
}

const getCloseError = async (databaseConnection: DatabaseConnection): Promise<null | Error> => {
  const possibleErr = await getError(async () => {
    await databaseConnection.close()
  })
  return possibleErr
}

const expectsValidDatabaseConnection = (conn: any): void => {
  expect(conn).toBeTruthy()
  expect(conn).toBeObject()
  expect(conn.open).toBeDefined()
  expect(conn.close).toBeDefined()
}

class MockPGClient extends Client {
  async connect(): Promise<void> {
    throw new Error("Mock Error connect")
  }

  async end(): Promise<void> {
    throw new Error("Mock Error end")
  }
}

let databaseConnection: DatabaseConnection

describe("PostgresDatabaseConnection | Open", () => {
  test("If the connection is falsy throws error", async () => {
    const connection = null
    databaseConnection = new PostgresDatabaseConnection(connection)
    // Given
    expect(connection).toBeNull()
    expectsValidDatabaseConnection(databaseConnection)
    // When
    const openErr = await getOpenError(databaseConnection)
    // Then
    expectsToHaveError(openErr)
    expect(openErr).toBeInstanceOf(DependencyInjectionError)
  })

  test("If the connection throws error to connect throws domain error", async () => {
    const connection = new MockPGClient()
    databaseConnection = new PostgresDatabaseConnection(connection)
    // Given
    expect(connection).toBeTruthy()
    expect(connection.connect).toBeDefined()
    expect(connection.connect).toBeFunction()
    expectsValidDatabaseConnection(databaseConnection)
    // When
    const openErr = await getOpenError(databaseConnection)
    // Then
    expectsToHaveError(openErr)
    expect(openErr).toBeInstanceOf(DataBaseConnectionError)
  })
})

describe("PostgresDatabaseConnection | Close", () => {
  test("If the connection is falsy throws error", async () => {
    const connection = null
    databaseConnection = new PostgresDatabaseConnection(connection)
    // Given
    expect(connection).toBeFalsy()
    expectsValidDatabaseConnection(databaseConnection)
    // When
    const closeErr = await getCloseError(databaseConnection)
    // Then
    expectsToHaveError(closeErr)
    expect(closeErr).toBeInstanceOf(DependencyInjectionError)
  })

  test("If the connection throws error to end throws domain error", async () => {
    const connection = new MockPGClient()
    databaseConnection = new PostgresDatabaseConnection(connection)
    // Given
    expect(connection).toBeTruthy()
    expect(connection.end).toBeDefined()
    expect(connection.end).toBeFunction()
    expectsValidDatabaseConnection(databaseConnection)
    // When
    const closeErr = await getCloseError(databaseConnection)
    // Then
    expectsToHaveError(closeErr)
    expect(closeErr).toBeInstanceOf(DataBaseConnectionError)
  })
})
