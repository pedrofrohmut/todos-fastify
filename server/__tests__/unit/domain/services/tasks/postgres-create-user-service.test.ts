import { CreateUser } from "../../../../../src/domain/types/user.types"

import PostgresCreateUserService from "../../../../../src/domain/services/users/implementations/postgres-create-user.service"

import { getError } from "../../../../utils/functions/error.functions"
import {
  expectsValidConnection,
  expectsValidService
} from "../../../../utils/functions/expects.functions"
import { MockConnectionAcceptMutate } from "../../../../utils/mocks/domain/database/database-connection.mock"

describe("PostgresCreateUserService | execute", () => {
  test("valid user should be added with no errors", async () => {
    const newUser: CreateUser = {
      name: "John Doe",
      email: "john@doe.com",
      passwordHash: "password_hash"
    }
    const mockMutate = jest.fn()
    const connection = MockConnectionAcceptMutate(mockMutate)()
    const createUserService = new PostgresCreateUserService(connection)
    // Given
    expectsValidConnection(connection)
    expectsValidService(createUserService)
    // @ts-ignore
    expect(createUserService.connection).toBeTruthy()
    // When
    const serviceErr = await getError(() => createUserService.execute(newUser))
    // Then
    expect(serviceErr).toBeFalsy()
    expect(mockMutate).toHaveBeenCalledTimes(1)
  })
})
