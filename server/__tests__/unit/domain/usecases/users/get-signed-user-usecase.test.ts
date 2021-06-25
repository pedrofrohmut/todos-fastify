import "jest-extended"

import PostgresFindUserByIdService from "../../../../../src/domain/services/users/implementations/postgres-find-user-by-id.service"
import JwtGenerateTokenService from "../../../../../src/domain/services/auth/implementations/jwt-generate-auth-token.service"
import JwtDecodeTokenService from "../../../../../src/domain/services/auth/implementations/jwt-decode-token.service"
import GetSignedUserUseCaseImplementation from "../../../../../src/domain/usecases/users/implementations/get-signed-user.usecase"

import UserNotFoundByIdError from "../../../../../src/domain/errors/users/user-not-found-by-id.error"

import FakeUserService from "../../../../utils/fakes/user-service.fake"
import FakeTokenService from "../../../../utils/fakes/token-service.fake"
import {getError} from "../../../../utils/functions/error.functions"
import {MockConnectionAcceptQuery} from "../../../../utils/mocks/domain/database/database-connection.mock"
import {expectsToHaveError} from "../../../../utils/functions/expects.functions"
import BcryptjsHashPasswordService from "../../../../../src/domain/services/auth/implementations/bcryptjs-hash-password.service"

const roundToSeconds = (n: number) => Math.floor(n / 1000)

const jwtSecret = FakeTokenService.getSecret()
const userId = FakeUserService.getValidUserId()
const generateTokenService = new JwtGenerateTokenService(jwtSecret)
const tokenDecoderService = new JwtDecodeTokenService(jwtSecret)
const hashPasswordService = new BcryptjsHashPasswordService()

describe("GetSignedUserUseCase | execute", () => {
  test("User not found by id throws UserNotFoundByIdError", async () => {
    const mockQuery = jest.fn(() => [])
    const connection = MockConnectionAcceptQuery(mockQuery)()
    const findUserByIdService = new PostgresFindUserByIdService(connection)
    const getSignedUserUseCase = new GetSignedUserUseCaseImplementation(findUserByIdService, generateTokenService)
    const token = generateTokenService.execute(userId)
    const decodedToken = tokenDecoderService.execute(token)
    const userFound = await findUserByIdService.execute(userId)
    // Given
    expect(userFound).toBeNull()
    // When
    const useCaseErr = await getError(() => getSignedUserUseCase.execute(decodedToken))
    // Then
    expectsToHaveError(useCaseErr, UserNotFoundByIdError)
  })

  // JsonWebToken lib uses seconds so rounding is needed
  test("User found => 200/SignedUserDto (new token with same exp of request token)", async () => {
    // Values
    const now = Date.now()
    const twoHours = 60 * 60 * 2
    const exp = roundToSeconds(now) + twoHours
    const passwordHash = await hashPasswordService.execute("user_password")
    const userDB = { id: userId, name: "User Name", email: "user@mail.com", password_hash: passwordHash }
    // Setup
    const mockQuery = jest.fn(() => [userDB])
    const connection = MockConnectionAcceptQuery(mockQuery)()
    const findUserByIdService = new PostgresFindUserByIdService(connection)
    const getSignedUserUseCase = new GetSignedUserUseCaseImplementation(findUserByIdService, generateTokenService)
    const token = generateTokenService.execute(userId, exp)
    const decodedToken = tokenDecoderService.execute(token)
    // Given values
    const userFound = await findUserByIdService.execute(userId)
    // Given
    expect(userFound).toEqual({ id: userId, name: userDB.name, email: userDB.email, passwordHash })
    // When
    const signedUser = await getSignedUserUseCase.execute(decodedToken)
    // Then
    expect(signedUser.id).toBe(userId)
    expect(signedUser.name).toBe(userDB.name)
    expect(signedUser.email).toBe(userDB.email)
    expect(signedUser.token).toBe(token)
  })
})
