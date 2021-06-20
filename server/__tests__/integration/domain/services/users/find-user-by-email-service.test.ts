import "jest-extended"

import PostgresFindUserByEmailService from "../../../../../src/domain/services/users/implementations/find-user-by-email.service"

import {
  expectsValidConnection,
  expectsValidService
} from "../../../../utils/functions/expects.functions"
import FakeUserService from "../../../../utils/fakes/user-service.fake"
import { MockConnectionAcceptQuery } from "../../../../utils/mocks/domain/database/database-connection.mock"

describe("PostgresFindUserByEmailService", () => {
  test("The users with the email is not registered => null", async () => {
    const mockQuery = jest.fn(() => [])
    const connection = MockConnectionAcceptQuery(mockQuery)()
    const email = "john@doe.com"
    const findUserByEmailService = new PostgresFindUserByEmailService(connection)
    // Given
    expectsValidConnection(connection)
    expectsValidService(findUserByEmailService)
    // @ts-ignore
    expect(findUserByEmailService.connection).toBeTruthy()
    // When
    const foundUser = await findUserByEmailService.execute(email)
    // Then
    expect(foundUser).toBeNull()
    expect(mockQuery).toHaveBeenCalledTimes(1)
  })

  test("The users with the email is registered => user", async () => {
    const userId = FakeUserService.getValidUserId()
    const name = "John Doe"
    const email = "john@doe.com"
    const passwordHash = "password_hash"
    const mockQuery = jest.fn(() => [
      {
        id: userId,
        name,
        email,
        password_hash: passwordHash
      }
    ])
    const connection = MockConnectionAcceptQuery(mockQuery)()
    const findUserByEmailService = new PostgresFindUserByEmailService(connection)
    // Given
    expectsValidConnection(connection)
    expectsValidService(findUserByEmailService)
    // @ts-ignore
    expect(findUserByEmailService.connection).toBeTruthy()
    // When
    const foundUser = await findUserByEmailService.execute(email)
    // Then
    expect(foundUser).toBeTruthy()
    expect(foundUser.id).toBe(userId)
    expect(foundUser.name).toBe(name)
    expect(foundUser.email).toBe(email)
    expect(foundUser.passwordHash).toBe(passwordHash)
    expect(mockQuery).toHaveBeenCalledTimes(1)
  })
})
