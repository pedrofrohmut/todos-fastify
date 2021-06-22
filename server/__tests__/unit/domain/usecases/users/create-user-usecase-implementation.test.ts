import "jest-extended"

import * as bcrypt from "bcryptjs"

import { CreateUserBody } from "../../../../../src/domain/types/request/body.types"

import BcryptjsHashPasswordService from "../../../../../src/domain/services/auth/implementations/bcryptjs-hash-password.service"
import CreateUserUseCaseImplementation from "../../../../../src/domain/usecases/users/implementations/create-user-implementation.usecase"
import PostgresCreateUserService from "../../../../../src/domain/services/users/implementations/postgres-create-user.service"
import PostgresFindUserByEmailService from "../../../../../src/domain/services/users/implementations/postgres-find-user-by-email.service"

import EmailAlreadyRegisteredError from "../../../../../src/domain/errors/users/email-already-registered.error"

import {
  MockConnectionAcceptQuery
} from "../../../../utils/mocks/domain/database/database-connection.mock"
import {
  expectsToHaveError,
  expectsValidConnection,
  expectsValidDBService,
  expectsValidService
} from "../../../../utils/functions/expects.functions"
import { getError } from "../../../../utils/functions/error.functions"

describe("CreateUserUseCaseImplementation", () => {
  const newUser: CreateUserBody = {
    name: "User Name",
    email: "user@mail.com",
    password: "password"
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
    const hashPasswordService = new BcryptjsHashPasswordService()
    const createUserService = new PostgresCreateUserService(connection)
    const createUserUseCase = new CreateUserUseCaseImplementation(
      findUserByEmailService,
      hashPasswordService,
      createUserService
    )
    // Given
    expectsValidConnection(connection)
    expectsValidDBService(findUserByEmailService)
    expectsValidService(hashPasswordService)
    expectsValidDBService(createUserService)
    expect(createUserUseCase).toBeTruthy()
    // @ts-ignore
    expect(createUserUseCase.findUserByEmailService).toBeTruthy()
    // @ts-ignore
    expect(createUserUseCase.hashPasswordService).toBeTruthy()
    // @ts-ignore
    expect(createUserUseCase.createUserService).toBeTruthy()
    // When
    const useCaseErr = await getError(() => createUserUseCase.execute(newUser))
    // Then
    expectsToHaveError(useCaseErr, EmailAlreadyRegisteredError)
    expect(connection.query).toHaveBeenCalledTimes(1)
    expect(connection.mutate).toHaveBeenCalledTimes(0)
  })

  test("If user not registered than create a new user with no errors", async () => {
    const mockQuery = jest.fn(() => [])
    const connection = MockConnectionAcceptQuery(mockQuery)()
    const findUserByEmailService = new PostgresFindUserByEmailService(connection)
    const hashPasswordService = new BcryptjsHashPasswordService()
    const createUserService = new PostgresCreateUserService(connection)
    const createUserUseCase = new CreateUserUseCaseImplementation(
      findUserByEmailService,
      hashPasswordService,
      createUserService
    )
    // Given
    expectsValidConnection(connection)
    expectsValidDBService(findUserByEmailService)
    expectsValidService(hashPasswordService)
    expectsValidDBService(createUserService)
    expect(createUserUseCase).toBeTruthy()
    // @ts-ignore
    expect(createUserUseCase.findUserByEmailService).toBeTruthy()
    // @ts-ignore
    expect(createUserUseCase.hashPasswordService).toBeTruthy()
    // @ts-ignore
    expect(createUserUseCase.createUserService).toBeTruthy()
    // When
    const useCaseErr = await getError(() => createUserUseCase.execute(newUser))
    // Then
    expect(useCaseErr).toBeFalsy()
    expect(connection.query).toHaveBeenCalledTimes(1)
    expect(connection.mutate).toHaveBeenCalledTimes(1)
    expect(connection.query).toHaveBeenCalledBefore(connection.mutate)
    const passwordHash = connection.mutate.mock.calls[0][1][2]
    expect(passwordHash).toBeTruthy()
    expect(passwordHash).toBeString()
    const isMatch = await bcrypt.compare(newUser.password, passwordHash)
    expect(isMatch).toBeTrue()
  })
})
