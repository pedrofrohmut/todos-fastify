import "jest-extended"

import { AdaptedRequest } from "../../../../../src/domain/types/router.types"

import GetSignedUserUseCaseImplementation from "../../../../../src/domain/usecases/users/implementations/get-signed-user.usecase"
import JwtGenerateAuthTokenService from "../../../../../src/domain/services/auth/implementations/jwt-generate-auth-token.service"
import PostgresFindUserByIdService from "../../../../../src/domain/services/users/implementations/postgres-find-user-by-id.service"
import GetSignedUserControllerImplementation from "../../../../../src/domain/controllers/users/implementations/get-signed-user.controller"

import FakeTokenService from "../../../../utils/fakes/token-service.fake"
import FakeUserService from "../../../../utils/fakes/user-service.fake"
import { expectsControllerResponse400AndMessage, expectsControllerResponse401AndMessage } from "../../../../utils/functions/expects.functions"
import MockConnection, {MockConnectionAcceptQuery} from "../../../../utils/mocks/domain/database/database-connection.mock"
import BcryptjsHashPasswordService from "../../../../../src/domain/services/auth/implementations/bcryptjs-hash-password.service"

const roundToSeconds = (n: number) => Math.floor(n / 1000)

const userId = FakeUserService.getValidUserId()
const iat = roundToSeconds(Date.now())
const twoHours = 2 * 60 * 60
const exp = iat + twoHours
const jwtSecret = FakeTokenService.getSecret()
const hashPasswordService = new BcryptjsHashPasswordService()

let request: AdaptedRequest<null>

beforeEach(() => {
  request = {
    body: null,
    authToken: {
      userId,
      iat,
      exp
    },
    params: null
  }
})

describe("GetSignedUserControllerImplementation | execute", () => {
  test("Null authToken = 401/message", async () => {
    request.authToken = null
    const connection = MockConnection()
    const findUserByIdService = new PostgresFindUserByIdService(connection)
    const generateAuthTokenService = new JwtGenerateAuthTokenService(jwtSecret)
    const getSignedUserUseCase = new GetSignedUserUseCaseImplementation(
      findUserByIdService,
      generateAuthTokenService
    )
    const getSignedUserController = new GetSignedUserControllerImplementation(getSignedUserUseCase)
    // Given
    expect(request.authToken).toBeNull()
    // When
    const controllerResponse = await getSignedUserController.execute(request)
    // Then
    expectsControllerResponse401AndMessage(controllerResponse)
  })

  test("Not null authToken. But user not found => 400/message", async () => {
    const mockQuery = jest.fn(() => [])
    const connection = MockConnectionAcceptQuery(mockQuery)()
    const findUserByIdService = new PostgresFindUserByIdService(connection)
    const generateAuthTokenService = new JwtGenerateAuthTokenService(jwtSecret)
    const getSignedUserUseCase = new GetSignedUserUseCaseImplementation(
      findUserByIdService,
      generateAuthTokenService
    )
    const getSignedUserController = new GetSignedUserControllerImplementation(getSignedUserUseCase)
    const userFound = await findUserByIdService.execute(userId)
    // Given
    expect(request.authToken).not.toBeNull()
    expect(userFound).toBeNull()
    // When
    const controllerResponse = await getSignedUserController.execute(request)
    // Then
    expectsControllerResponse400AndMessage(controllerResponse)
  })

  test("Valid authToken and user found => 200/SignedUserDto", async () => {
    const passwordHash = await hashPasswordService.execute("user_password")
    const userDB = { id: userId, name: "User Name", email: "user@mail.com", password_hash: passwordHash }
    const mockQuery = jest.fn(() => [userDB])
    const connection = MockConnectionAcceptQuery(mockQuery)()
    const findUserByIdService = new PostgresFindUserByIdService(connection)
    const generateAuthTokenService = new JwtGenerateAuthTokenService(jwtSecret)
    const getSignedUserUseCase = new GetSignedUserUseCaseImplementation(
      findUserByIdService,
      generateAuthTokenService
    )
    const getSignedUserController = new GetSignedUserControllerImplementation(getSignedUserUseCase)
    const userFound = await findUserByIdService.execute(userId)
    // Given
    expect(request.authToken).not.toBeNull()
    expect(userFound).toEqual({ id: userId, name: userDB.name, email: userDB.email, passwordHash })
    // When
    const controllerResponse = await getSignedUserController.execute(request)
    // Then
    expect(controllerResponse.status).toBe(200)
    const token = generateAuthTokenService.execute(userId, request.authToken.exp)
    expect(controllerResponse.body).toEqual({ id: userId, name: userDB.name, email: userDB.email, token })
  })
})
