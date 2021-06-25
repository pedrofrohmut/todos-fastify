import "jest-extended"

import UserValidatorImplementation from "../../../../../src/domain/validators/implementations/user.validator"
import JwtGenerateAuthTokenService from "../../../../../src/domain/services/auth/implementations/jwt-generate-auth-token.service"
import JwtDecodeTokenService from "../../../../../src/domain/services/auth/implementations/jwt-decode-token.service"

import FakeUserService from "../../../../utils/fakes/user-service.fake"
import FakeTokenService from "../../../../utils/fakes/token-service.fake"
import { expectsValidTokenOneHourExpiration, expectsValidTokenThatExpiresIn } from "../../../../utils/functions/expects.functions"

const jwtSecret = FakeTokenService.getSecret()
const userValidator = new UserValidatorImplementation()
const generateTokenService = new JwtGenerateAuthTokenService(jwtSecret)
const tokenDecoderService = new JwtDecodeTokenService(jwtSecret)

describe("JwtGenerateAuthTokenService", () => {
  test("Valid user id => authToken that expires in one day", () => {
    const userId = FakeUserService.getValidUserId()
    const userIdValidationMessage = userValidator.getMessageForId(userId)
    // Given
    expect(userIdValidationMessage).toBeNull()
    // When
    const token = generateTokenService.execute(userId)
    // Then
    const decoded = tokenDecoderService.execute(token)
    expectsValidTokenOneHourExpiration(token, decoded, userId)
  })

  test("Valid user id and valid exp => authToken that expires in exp passed", () => {
    const userId = FakeUserService.getValidUserId()
    const exp = Date.now() + (2 * 60 * 60)
    const userIdValidationMessage = userValidator.getMessageForId(userId)
    // Given
    expect(userIdValidationMessage).toBeNull()
    expect(exp).toBeGreaterThan(0)
    expect(exp).toBeGreaterThan(Date.now())
    // When
    const token = generateTokenService.execute(userId, exp)
    // Then
    const decoded = tokenDecoderService.execute(token)
    expectsValidTokenThatExpiresIn(token, decoded, userId, exp)
  })
})
