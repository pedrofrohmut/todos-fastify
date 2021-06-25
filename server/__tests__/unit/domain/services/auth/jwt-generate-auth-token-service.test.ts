import "jest-extended"

import UserValidatorImplementation from "../../../../../src/domain/validators/implementations/user.validator"
import JwtGenerateAuthTokenService from "../../../../../src/domain/services/auth/implementations/jwt-generate-auth-token.service"

import FakeUserService from "../../../../utils/fakes/user-service.fake"
import FakeTokenService from "../../../../utils/fakes/token-service.fake"
import { expectsValidTokenOneHourExpiration } from "../../../../utils/functions/expects.functions"

const userValidator = new UserValidatorImplementation()
const generateTokenService = new JwtGenerateAuthTokenService()

describe("JwtGenerateAuthTokenService", () => {
  test("Valid user id => returns authToken that expires in one day", () => {
    const secret = FakeTokenService.getSecret()
    const userId = FakeUserService.getValidUserId()
    const userIdValidationMessage = userValidator.getMessageForId(userId)
    // Given
    expect(userIdValidationMessage).toBeNull()
    // When
    const token = generateTokenService.execute(userId, secret)
    // Then
    const decoded = FakeTokenService.decode(token)
    expectsValidTokenOneHourExpiration(token, decoded, userId)
  })
})
