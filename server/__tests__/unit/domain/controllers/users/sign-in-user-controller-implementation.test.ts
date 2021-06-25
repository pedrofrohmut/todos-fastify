import "jest-extended"

import {AdaptedRequest} from "../../../../../src/domain/types/router.types"
import {SignInUserBody} from "../../../../../src/domain/types/request/body.types"

import SignInUserControllerImplementation from "../../../../../src/domain/controllers/users/implementations/sign-in-user.controller"
import UserValidatorImplementation from "../../../../../src/domain/validators/implementations/user.validator"
import PostgresFindUserByEmailService from "../../../../../src/domain/services/users/implementations/postgres-find-user-by-email.service"
import BcryptjsHashPasswordService from "../../../../../src/domain/services/auth/implementations/bcryptjs-hash-password.service"
import BcryptjsComparePasswordAndHashService from "../../../../../src/domain/services/auth/implementations/bcryptjs-compare-password-and-hash.service"
import JwtGenerateAuthTokenService from "../../../../../src/domain/services/auth/implementations/jwt-generate-auth-token.service"
import SignInUserUseCaseImplementation from "../../../../../src/domain/usecases/users/implementations/sign-in-user.usecase"

import PasswordAndHashDontMatchError from "../../../../../src/domain/errors/auth/password-and-hash-dont-match.error"
import UserNotFoundByEmailError from "../../../../../src/domain/errors/users/user-not-found-by-email.error"

import {expectsControllerResponse400AndMessage, expectsValidTokenOneHourExpiration} from "../../../../utils/functions/expects.functions"
import MockConnection, {MockConnectionAcceptQuery} from "../../../../utils/mocks/domain/database/database-connection.mock"
import FakeTokenService from "../../../../utils/fakes/token-service.fake"
import FakeUserService from "../../../../utils/fakes/user-service.fake"
import {SignedUserDto} from "../../../../../src/domain/types/user.types"

const jwtSecret = FakeTokenService.getSecret()
const userValidator = new UserValidatorImplementation()
const connection = MockConnection()
const findUserByEmailService = new PostgresFindUserByEmailService(connection)
const comparePasswordAndHashService = new BcryptjsComparePasswordAndHashService()
const generateAuthTokenService = new JwtGenerateAuthTokenService()
const hashPasswordService = new BcryptjsHashPasswordService()
const signInUserUseCase = new SignInUserUseCaseImplementation(findUserByEmailService, comparePasswordAndHashService, generateAuthTokenService, jwtSecret)
const signInUserController = new SignInUserControllerImplementation(userValidator, signInUserUseCase)

let request: AdaptedRequest<SignInUserBody>

beforeEach(() => {
  request = {
    body: {
      email: "user@mail.com",
      password: "user_password"
    },
    authUserId: null,
    params: null
  }
})

describe("SignInUserControllerImplementation", () => {
  test("Null body => 400/message", async () => {
    request.body = null
    // Given
    expect(request.body).toBeNull()
    // When
    const controllerResponse = await signInUserController.execute(request)
    // Then
    expectsControllerResponse400AndMessage(controllerResponse)
  })

  test("Invalid email => 400/message", async () => {
    request.body.email = "invalid_email"
    const emailValidationMessage = userValidator.getMessageForEmail(request.body.email)
    // Given
    expect(emailValidationMessage).toBeTruthy()
    // When
    const controllerResponse = await signInUserController.execute(request)
    // Then
    expectsControllerResponse400AndMessage(controllerResponse)
  })

  test("Invalid password => 400/message", async () => {
    request.body.password = "12"
    const passwordValidationMessage = userValidator.getMessageForPassword(request.body.password)
    // Given
    expect(passwordValidationMessage).toBeTruthy()
    // When
    const controllerResponse = await signInUserController.execute(request)
    // Then
    expectsControllerResponse400AndMessage(controllerResponse)
  })

  test("User not found by email => 400/message", async () => {
    const mockQuery = jest.fn(() => [])
    const connection = MockConnectionAcceptQuery(mockQuery)()
    const findUserByEmailService = new PostgresFindUserByEmailService(connection)
    const signInUserUseCase = new SignInUserUseCaseImplementation(findUserByEmailService, comparePasswordAndHashService, generateAuthTokenService, jwtSecret)
    const signInUserController = new SignInUserControllerImplementation(userValidator, signInUserUseCase)
    const userFound = await findUserByEmailService.execute(request.body.email)
    // Given
    expect(userFound).toBeNull()
    // When
    const controllerResponse = await signInUserController.execute(request)
    // Then
    expectsControllerResponse400AndMessage(controllerResponse)
    expect(controllerResponse.body).toContain(UserNotFoundByEmailError.message)
  })

  test("User found. But password dont match => 400/message", async () => {
    // Values
    const userId = FakeUserService.getValidUserId()
    const passwordHash = await hashPasswordService.execute("other_password")
    const userDB = { id: userId, name: "John Doe", email: request.body.email, password_hash: passwordHash }
    // Setup
    const mockQuery = jest.fn(() => [userDB])
    const connection = MockConnectionAcceptQuery(mockQuery)()
    const findUserByEmailService = new PostgresFindUserByEmailService(connection)
    const signInUserUseCase = new SignInUserUseCaseImplementation(findUserByEmailService, comparePasswordAndHashService, generateAuthTokenService, jwtSecret)
    const signInUserController = new SignInUserControllerImplementation(userValidator, signInUserUseCase)
    // Given Values
    const userFound = await findUserByEmailService.execute(request.body.email)
    const isMatch = await comparePasswordAndHashService.execute(request.body.password, passwordHash)
    // Given
    expect(userFound).toEqual({ id: userId, name: userDB.name, email: request.body.email, passwordHash })
    expect(isMatch).toBeFalse()
    // When
    const controllerResponse = await signInUserController.execute(request)
    // Then
    expectsControllerResponse400AndMessage(controllerResponse)
    expect(controllerResponse.body).toContain(PasswordAndHashDontMatchError.message)
  })

  test("User found and password match => 200/SignedUserDto", async () => {
    // Values
    const userId = FakeUserService.getValidUserId()
    const passwordHash = await hashPasswordService.execute(request.body.password)
    const userDB = { id: userId, name: "John Doe", email: request.body.email, password_hash: passwordHash }
    // Setup
    const mockQuery = jest.fn(() => [userDB])
    const connection = MockConnectionAcceptQuery(mockQuery)()
    const findUserByEmailService = new PostgresFindUserByEmailService(connection)
    const signInUserUseCase = new SignInUserUseCaseImplementation(findUserByEmailService, comparePasswordAndHashService, generateAuthTokenService, jwtSecret)
    const signInUserController = new SignInUserControllerImplementation(userValidator, signInUserUseCase)
    // Given Values
    const userFound = await findUserByEmailService.execute(request.body.email)
    const isMatch = await comparePasswordAndHashService.execute(request.body.password, passwordHash)
    // Given
    expect(userFound).toEqual({ id: userId, name: userDB.name, email: request.body.email, passwordHash })
    expect(isMatch).toBeTrue()
    // When
    const controllerResponse = await signInUserController.execute(request)
    // Then
    expect(controllerResponse.status).toBe(200)
    const body = controllerResponse.body as SignedUserDto
    expect(body.id).toBe(userId)
    expect(body.name).toBe(userDB.name)
    expect(body.email).toBe(request.body.email)
    const decoded = FakeTokenService.decode(body.token)
    expectsValidTokenOneHourExpiration(body.token, decoded, userId)
  })
})
