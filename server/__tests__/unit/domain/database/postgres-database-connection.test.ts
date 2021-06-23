import "jest-extended"

import PostgresDatabaseConnection from "../../../../src/domain/database/implementations/postgres.database-connection"

import DataBaseConnectionError from "../../../../src/domain/errors/database/connection.error"

import { getError } from "../../../utils/functions/error.functions"
import { expectsToHaveError } from "../../../utils/functions/expects.functions"
import {
  MockPgClientAcceptConnect,
  MockPgClientAcceptEnd,
  MockPgClientAcceptQuery
} from "../../../utils/mocks/external/pg-client.mock"

describe("PostgresDatabaseConnection", () => {
  test("When the client throws error to connect the connection throws domain error", async () => {
    const mockConnect = jest.fn(() => {
      throw new Error("Mock Connect Error")
    })
    const client = MockPgClientAcceptConnect(mockConnect)()
    const databaseConnection = new PostgresDatabaseConnection(client)
    const connectErr = await getError(() => client.connect())
    // Given
    expect(connectErr).toBeTruthy()
    expect(client.connect).toHaveBeenCalledTimes(1)
    // When
    const openErr = await getError(() => databaseConnection.open())
    // Then
    expectsToHaveError(openErr)
    expect(openErr).toBeInstanceOf(DataBaseConnectionError)
    expect(client.connect).toHaveBeenCalledTimes(2)
  })

  test("When the client throws error to end the connection throws domain error", async () => {
    const mockEnd = jest.fn(() => {
      throw new Error("Mock End Error")
    })
    const client = MockPgClientAcceptEnd(mockEnd)()
    const databaseConnection = new PostgresDatabaseConnection(client)
    const endErr = await getError(() => client.end())
    // Given
    expect(endErr).toBeTruthy()
    expect(client.end).toHaveBeenCalledTimes(1)
    // When
    const closeErr = await getError(() => databaseConnection.close())
    // Then
    expectsToHaveError(closeErr)
    expect(closeErr).toBeInstanceOf(DataBaseConnectionError)
    expect(client.end).toHaveBeenCalledTimes(2)
  })

  test("When the client throws error to query the connection throws domain error", async () => {
    const mockQuery = jest.fn(() => {
      throw new Error("Mock Query Error")
    })
    const client = MockPgClientAcceptQuery(mockQuery)()
    const databaseConnection = new PostgresDatabaseConnection(client)
    const clientQueryErr = await getError(() => client.query())
    // Given
    expectsToHaveError(clientQueryErr)
    expect(client.query).toHaveBeenCalledTimes(1)
    // When
    const queryErr = await getError(() => databaseConnection.query("", [123]))
    // Then
    expectsToHaveError(queryErr)
    expect(queryErr).toBeInstanceOf(DataBaseConnectionError)
    expect(client.query).toHaveBeenCalledTimes(2)
  })
})
