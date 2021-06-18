import FindUserByIdServiceImplementation from "../../../../../src/domain/services/users/implementations/find-user-by-id.service"

import {
  MockConnectionReturnEmpty,
  MockConnectionReturnOne
} from "../../../../utils/mocks/domain/database/database-connection.mock"

const userId = "userId"
const userName = "userName"
const userEmail = "user@email.com"
const userPasswordHash = "password_hash"

describe("FindUserByIdServiceImplementation", () => {
  test("User not found => null", async () => {
    // Given
    const connection = new MockConnectionReturnEmpty()
    const findUserByIdService = new FindUserByIdServiceImplementation(connection)
    // When
    const foundUser = await findUserByIdService.execute("")
    // Then
    expect(foundUser).toBeNull()
  })

  test("User found => User", async () => {
    // Given
    const connection = new MockConnectionReturnOne({
      id: userId,
      name: userName,
      email: userEmail,
      password_hash: userPasswordHash
    })
    const findUserByIdService = new FindUserByIdServiceImplementation(connection)
    // When
    const foundUser = await findUserByIdService.execute(userId)
    // Then
    expect(foundUser).toBeTruthy()
    expect(foundUser.id).toBe(userId)
    expect(foundUser.name).toBe(userName)
    expect(foundUser.email).toBe(userEmail)
    expect(foundUser.passwordHash).toBe(userPasswordHash)
  })
})
