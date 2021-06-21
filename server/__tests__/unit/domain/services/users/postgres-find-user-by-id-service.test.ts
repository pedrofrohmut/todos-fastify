import "jest-extended"

import PostgresFindUserByIdService from "../../../../../src/domain/services/users/implementations/postgres-find-user-by-id.service"

import {
  expectsValidConnection,
  expectsValidService
} from "../../../../utils/functions/expects.functions"
import FakeUserService from "../../../../utils/fakes/user-service.fake"
import { MockConnectionAcceptQuery } from "../../../../utils/mocks/domain/database/database-connection.mock"

describe("FindUserByIdServiceImplementation | Execute", () => {
  test("If user not found return null", async () => {
    const userId = FakeUserService.getValidUserId()
    const mockQuery = jest.fn(() => [])
    const connection = MockConnectionAcceptQuery(mockQuery)()
    const findUserByIdService = new PostgresFindUserByIdService(connection)
    // Given
    expectsValidConnection(connection)
    expectsValidService(findUserByIdService)
    // @ts-ignore
    expect(findUserByIdService.connection).toBeTruthy()
    // When
    const foundUser = await findUserByIdService.execute(userId)
    // Then
    expect(foundUser).toBeNull()
    expect(mockQuery).toHaveBeenCalledTimes(1)
  })

  test("If user found return user", async () => {
    const userId = FakeUserService.getValidUserId()
    const name = "John Doe"
    const email = "john@doe.com"
    const password_hash = "password_hash"
    const mockQuery = jest.fn(() => [{ name, email, password_hash }])
    const connection = MockConnectionAcceptQuery(mockQuery)()
    const findUserByIdService = new PostgresFindUserByIdService(connection)
    // Given
    expectsValidConnection(connection)
    expectsValidService(findUserByIdService)
    // @ts-ignore
    expect(findUserByIdService.connection).toBeTruthy()
    // When
    const foundUser = await findUserByIdService.execute(userId)
    // Then
    expect(foundUser).toBeTruthy()
    expect(foundUser.id).toBe(userId)
    expect(foundUser.name).toBe(name)
    expect(foundUser.email).toBe(email)
    expect(foundUser.passwordHash).toBe(password_hash)
    expect(mockQuery).toHaveBeenCalledTimes(1)
  })
})
