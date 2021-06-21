import PostgresFindUserByIdService from "../../../../../src/domain/services/users/implementations/postgres-find-user-by-id.service"

const userId = "userId"
const userName = "userName"
const userEmail = "user@email.com"
const userPasswordHash = "password_hash"

describe("PostgresFindUserByIdService", () => {
  test("User not found => null", async () => {
    // Given
    const mockQuery = jest.fn(() => [])
    const mockConnection = jest.fn().mockImplementation(() => ({
      query: mockQuery
    }))()
    const findUserByIdService = new PostgresFindUserByIdService(mockConnection)
    // When
    const foundUser = await findUserByIdService.execute("")
    // Then
    expect(foundUser).toBeNull()
    expect(mockQuery).toHaveBeenCalled()
  })

  test("User found => User", async () => {
    // Given
    const mockQuery = jest.fn(() => [
      {
        id: userId,
        name: userName,
        email: userEmail,
        password_hash: userPasswordHash
      }
    ])
    const mockConnection = jest.fn().mockImplementation(() => ({
      query: mockQuery
    }))()
    const findUserByIdService = new PostgresFindUserByIdService(mockConnection)
    // When
    const foundUser = await findUserByIdService.execute(userId)
    // Then
    expect(foundUser).toBeTruthy()
    expect(foundUser.id).toBe(userId)
    expect(foundUser.name).toBe(userName)
    expect(foundUser.email).toBe(userEmail)
    expect(foundUser.passwordHash).toBe(userPasswordHash)
    expect(mockQuery).toHaveBeenCalled()
  })
})
