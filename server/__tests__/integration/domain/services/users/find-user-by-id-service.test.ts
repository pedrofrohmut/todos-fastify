import "jest-extended"

import FindUserByIdService from "../../../../../src/domain/services/users/find-user-by-id-service.interface"

import FindUserByIdServiceImplementation from "../../../../../src/domain/services/users/implementations/find-user-by-id.service"
import PostgresConnectionFactory from "../../../../../src/domain/factories/implementations/postgres-connection.factory"
import DatabaseConnection from "../../../../../src/domain/database/database-connection.interface"

import { isValidUUIDv4 } from "../../../../utils/functions/validation.functions"
import { expectsValidUser } from "../../../../utils/functions/expects.functions"
import { UserTable } from "../../../../../src/domain/types/user.types"
import { createUserQuery, findUserByIdQuery } from "../../../../utils/functions/queries.functions"
import { getError } from "../../../../utils/functions/error.functions"

const insertUserIfNull = async (connection: DatabaseConnection, userId: string) => {
  const possibleError = await getError(async () => {
    const foundUser = await findUserByIdQuery(connection, userId)
    if (foundUser === null) {
      await createUserQuery(connection, {
        id: userId,
        name: "John Doe",
        email: "john@doe.com",
        password_hash: "password_hash"
      })
    }
  })
  return possibleError
}

const connection = new PostgresConnectionFactory().getConnection()

let findUserByIdService: FindUserByIdService

beforeAll(async () => {
  await connection.open()
})

beforeEach(() => {
  findUserByIdService = new FindUserByIdServiceImplementation(connection)
})

afterAll(async () => {
  await connection.close()
})

describe("FindUserByIdServiceImplementation | Execute", () => {
  test("If user found return user", async () => {
    const userId = "1d0ae93c-8e9f-4f3b-a48d-668a1bcd2ed1"
    const foundUserErr = await insertUserIfNull(connection, userId)
    // Given
    expect(foundUserErr).toBeFalsy()
    expect(userId).toBeTruthy()
    expect(userId).toBeString()
    expect(isValidUUIDv4(userId)).toBeTrue()
    // When
    const foundUser = await findUserByIdService.execute(userId)
    // Then
    expectsValidUser(foundUser)
  })

  test("If user not found return null", async () => {
    const userId = "8da10246-715e-4142-9490-ba841715778b"
    const foundUser = await findUserByIdQuery(connection, userId)
    // Given
    expect(foundUser).toBeFalsy()
    expect(userId).toBeTruthy()
    expect(userId).toBeString()
    expect(isValidUUIDv4(userId)).toBeTrue()
    // When
    const foundUserService = await findUserByIdService.execute(userId)
    // Then
    expect(foundUserService).toBeNull()
  })
})
