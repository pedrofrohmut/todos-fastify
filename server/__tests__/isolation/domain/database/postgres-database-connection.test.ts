import "jest-extended"

import PostgresDatabaseConnection from "../../../../src/domain/database/implementations/postgres.database-connection"

import DataBaseConnectionError from "../../../../src/domain/errors/database/connection.error"

import { getError } from "../../../utils/functions/error.functions"
import { expectsToHaveError } from "../../../utils/functions/expects.functions"

const expectsValidDatabaseConnection = (conn: any): void => {
  expect(conn).toBeTruthy()
  expect(conn).toBeObject()
  expect(conn.open).toBeDefined()
  expect(conn.close).toBeDefined()
  expect(conn.query).toBeDefined()
  expect(conn.mutate).toBeDefined()
}

const mockConnect = jest.fn(() => {
  throw new Error("Mock error connect")
})

const mockEnd = jest.fn(() => {
  throw new Error("Mock error end")
})

const mockQuery = jest.fn(() => {
  throw new Error("Mock error query")
})

const MockPostgresClient = jest.fn().mockImplementation(() => {
  return {
    connect: mockConnect,
    end: mockEnd,
    query: mockQuery
  }
})

beforeEach(() => {
  mockConnect.mockClear()
  mockEnd.mockClear()
  MockPostgresClient.mockClear()
})

describe("PostgresDatabaseConnection | Open", () => {
  test("If the connection throws error to connect throws domain error", async () => {
    const databaseConnection = new PostgresDatabaseConnection(MockPostgresClient())
    // Given
    expectsValidDatabaseConnection(databaseConnection)
    // When
    const openErr = await getError(() => databaseConnection.open())
    // Then
    expectsToHaveError(openErr)
    expect(openErr).toBeInstanceOf(DataBaseConnectionError)
    expect(mockConnect).toHaveBeenCalled()
  })
})

describe("PostgresDatabaseConnection | Close", () => {
  test("If the connection throws error to end throws domain error", async () => {
    const databaseConnection = new PostgresDatabaseConnection(MockPostgresClient())
    // Given
    expectsValidDatabaseConnection(databaseConnection)
    // When
    const closeErr = await getError(() => databaseConnection.close())
    // Then
    expectsToHaveError(closeErr)
    expect(closeErr).toBeInstanceOf(DataBaseConnectionError)
    expect(mockEnd).toHaveBeenCalled()
  })
})

describe("PostgresDatabaseConnection | Query & Mutate", () => {
  test("If the connection throws error to query throws domain error", async () => {
    const databaseConnection = new PostgresDatabaseConnection(MockPostgresClient())
    // Given
    expectsValidDatabaseConnection(databaseConnection)
    // When
    const queryErr = await getError(() => databaseConnection.query("", [123]))
    // Then
    expectsToHaveError(queryErr)
    expect(queryErr).toBeInstanceOf(DataBaseConnectionError)
    expect(mockQuery).toHaveBeenCalled()
  })
})
