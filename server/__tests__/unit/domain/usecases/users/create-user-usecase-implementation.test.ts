import "jest-extended"

import { CreateUserDto } from "../../../../../src/domain/types/user.types"

import CreateUserUseCaseImplementation from "../../../../../src/domain/usecases/users/implementations/create-user-implementation.usecase"
import PostgresFindUserByEmailService from "../../../../../src/domain/services/users/implementations/postgres-find-user-by-email.service"
import PostgresCreateUserService from "../../../../../src/domain/services/users/implementations/postgres-create-user.service"

import EmailAlreadyRegisteredError from "../../../../../src/domain/errors/users/email-already-registered.error"

import {
  MockConnectionAcceptQuery,
  mockMutate
} from "../../../../utils/mocks/domain/database/database-connection.mock"
import {
  expectsToHaveError,
  expectsValidConnection,
  expectsValidDBService
} from "../../../../utils/functions/expects.functions"
import { getError } from "../../../../utils/functions/error.functions"

describe("CreateUserUseCaseImplementation", () => {
  const newUser: CreateUserDto = {
    name: "User Name",
    email: "user@mail.com",
    passwordHash: "passwordHash"
  }

  test("User is found by email throw EmailAlreadyRegisteredError", async () => {
    const mockQuery = jest.fn(() => [
      {
        name: "User Name",
        email: "user@mail.com",
        passwordHash: "passwordHash"
      }
    ])
    const connection = MockConnectionAcceptQuery(mockQuery)()
    const findUserByEmailService = new PostgresFindUserByEmailService(connection)
    const createUserService = new PostgresCreateUserService(connection)
    const createUserUseCase = new CreateUserUseCaseImplementation(
      findUserByEmailService,
      createUserService
    )
    // Given
    expectsValidConnection(connection)
    expectsValidDBService(findUserByEmailService)
    expectsValidDBService(createUserService)
    expect(createUserUseCase).toBeTruthy()
    // @ts-ignore
    expect(createUserUseCase.findUserByEmailService).toBeTruthy()
    // @ts-ignore
    expect(createUserUseCase.createUserService).toBeTruthy()
    // When
    const useCaseErr = await getError(() => createUserUseCase.execute(newUser))
    // Then
    expectsToHaveError(useCaseErr, EmailAlreadyRegisteredError)
    expect(mockQuery).toHaveBeenCalledTimes(1)
    expect(mockMutate).toHaveBeenCalledTimes(0)
  })

  test("If user not registered than create a new user with no errors", async () => {
    const mockQuery = jest.fn(() => [])
    const connection = MockConnectionAcceptQuery(mockQuery)()
    const findUserByEmailService = new PostgresFindUserByEmailService(connection)
    const createUserService = new PostgresCreateUserService(connection)
    const createUserUseCase = new CreateUserUseCaseImplementation(
      findUserByEmailService,
      createUserService
    )
    // Given
    expectsValidConnection(connection)
    expectsValidDBService(findUserByEmailService)
    expectsValidDBService(createUserService)
    expect(createUserUseCase).toBeTruthy()
    // @ts-ignore
    expect(createUserUseCase.findUserByEmailService).toBeTruthy()
    // @ts-ignore
    expect(createUserUseCase.createUserService).toBeTruthy()
    // When
    const useCaseErr = await getError(() => createUserUseCase.execute(newUser))
    // Then
    expect(useCaseErr).toBeFalsy()
    expect(mockQuery).toHaveBeenCalledTimes(1)
    expect(mockMutate).toHaveBeenCalledTimes(1)
    expect(mockMutate).toHaveBeenCalledAfter(mockQuery)
  })
})
