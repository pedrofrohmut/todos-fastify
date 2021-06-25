import "jest-extended"

import { SignInUserBody } from "../../../../../src/domain/types/request/body.types"

import FindUserByEmailService from "../../../../../src/domain/services/users/find-user-by-email-service.interface"

import JwtGenerateAuthTokenService from "../../../../../src/domain/services/auth/implementations/jwt-generate-auth-token.service"
import PostgresFindUserByEmailService from "../../../../../src/domain/services/users/implementations/postgres-find-user-by-email.service"
import BcryptjsComparePasswordAndHashService from "../../../../../src/domain/services/auth/implementations/bcryptjs-compare-password-and-hash.service"
import BcryptjsHashPasswordService from "../../../../../src/domain/services/auth/implementations/bcryptjs-hash-password.service"
import SignInUserUseCaseImplementation from "../../../../../src/domain/usecases/users/implementations/sign-in-user.usecase"

import UserNotFoundByEmailError from "../../../../../src/domain/errors/users/user-not-found-by-email.error"
import PasswordAndHashDontMatchError from "../../../../../src/domain/errors/auth/password-and-hash-dont-match.error"

import { MockConnectionAcceptQuery } from "../../../../utils/mocks/domain/database/database-connection.mock"
import { getError } from "../../../../utils/functions/error.functions"
import { expectsToHaveError, expectsValidTokenOneHourExpiration } from "../../../../utils/functions/expects.functions"
import FakeUserService from "../../../../utils/fakes/user-service.fake"
import FakeTokenService from "../../../../utils/fakes/token-service.fake"

const jwtSecret = FakeTokenService.getSecret()
const credentials: SignInUserBody = {
  email: "user@email.com",
  password: "password"
}
const comparePasswordAndHashService = new BcryptjsComparePasswordAndHashService()
const generateAuthTokenService = new JwtGenerateAuthTokenService(jwtSecret)
const hashPasswordService = new BcryptjsHashPasswordService()

describe("SignInUserUseCaseImplementation | execute", () => {
  const buildUseCase = (findUserByEmailService: FindUserByEmailService) => {
    const signInUserUseCase = new SignInUserUseCaseImplementation(
      findUserByEmailService,
      comparePasswordAndHashService,
      generateAuthTokenService
    )
    return signInUserUseCase
  }

  test("User not found by email then throws UserNotFoundByEmailError", async () => {
    const mockQuery = jest.fn(() => [])
    const connection = MockConnectionAcceptQuery(mockQuery)()
    const findUserByEmailService = new PostgresFindUserByEmailService(connection)
    const signInUserUseCase = buildUseCase(findUserByEmailService)
    const userFound = await findUserByEmailService.execute(credentials.email)
    // Given
    expect(userFound).toBeNull()
    // When
    const useCaseErr = await getError(() => signInUserUseCase.execute(credentials))
    // Then
    expectsToHaveError(useCaseErr, UserNotFoundByEmailError)
  })

  test("User found. But password and hash dont match then throws PasswordAndHashDontMatchError", async () => {
    // Values
    const userId = FakeUserService.getValidUserId()
    const passwordHash = await hashPasswordService.execute("other_password")
    const userDB = {
      id: userId,
      name: "User Name",
      email: "user@mail.com",
      password_hash: passwordHash
    }
    const credentials = { email: userDB.email, password: "user_password" }
    // Setup
    const mockQuery = jest.fn(() => [userDB])
    const connection = MockConnectionAcceptQuery(mockQuery)()
    const findUserByEmailService = new PostgresFindUserByEmailService(connection)
    const signInUserUseCase = buildUseCase(findUserByEmailService)
    // Given Values
    const userFound = await findUserByEmailService.execute(credentials.email)
    const isMatch = await comparePasswordAndHashService.execute(credentials.password, passwordHash)
    // Given
    expect(userFound).toEqual({ id: userId, name: userDB.name, email: userDB.email, passwordHash })
    expect(isMatch).toBeFalse()
    // When
    const useCaseErr = await getError(() => signInUserUseCase.execute(credentials))
    // Then
    expectsToHaveError(useCaseErr, PasswordAndHashDontMatchError)
  })

  test("User found. Password and hash match. Token is generated => SignedUserDto", async () => {
    // Values
    const userId = FakeUserService.getValidUserId()
    const email = "user@mail.com"
    const password = "user_password"
    const passwordHash = await hashPasswordService.execute(password)
    const userDB = { id: userId, name: "User Name", email, password_hash: passwordHash }
    const credentials = { email, password }
    // Setup
    const mockQuery = jest.fn(() => [userDB])
    const connection = MockConnectionAcceptQuery(mockQuery)()
    const findUserByEmailService = new PostgresFindUserByEmailService(connection)
    const signInUserUseCase = buildUseCase(findUserByEmailService)
    // Given Values
    const userFound = await findUserByEmailService.execute(credentials.email)
    const isMatch = await comparePasswordAndHashService.execute(credentials.password, passwordHash)
    // Given
    expect(userFound).toEqual({ id: userId, name: userDB.name, email, passwordHash })
    expect(isMatch).toBeTrue()
    // When
    const signedUser = await signInUserUseCase.execute(credentials)
    // Then
    expect(signedUser).toBeTruthy()
    expect(signedUser).toBeObject()
    expect(signedUser.id).toBeTruthy()
    expect(signedUser.name).toBeTruthy()
    expect(signedUser.email).toBeTruthy()
    const decoded = FakeTokenService.decode(signedUser.token)
    expectsValidTokenOneHourExpiration(signedUser.token, decoded, userId)
  })
})
