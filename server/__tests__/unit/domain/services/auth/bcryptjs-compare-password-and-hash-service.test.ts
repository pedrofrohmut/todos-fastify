import "jest-extended"

import UserValidatorImplementation from "../../../../../src/domain/validators/implementations/user.validator"
import BcryptjsHashPasswordService from "../../../../../src/domain/services/auth/implementations/bcryptjs-hash-password.service"
import BcryptjsComparePasswordAndHashService from "../../../../../src/domain/services/auth/implementations/bcryptjs-compare-password-and-hash.service"

const userValidator = new UserValidatorImplementation()
const hashPasswordService = new BcryptjsHashPasswordService()
const comparePasswordHashService = new BcryptjsComparePasswordAndHashService()

describe("BcryptjsComparePasswordAndHashService | execute", () => {
  test("Valid password that does not match return false", async () => {
    const password = "123"
    const unmatchPassword = "456"
    const passwordValidationMessage = userValidator.getMessageForPassword(unmatchPassword)
    const hash = await hashPasswordService.execute(unmatchPassword)
    // Given
    expect(passwordValidationMessage).toBeNull()
    // When
    const isMatch = await comparePasswordHashService.execute(password, hash)
    // Then
    expect(isMatch).toBeFalse()
  })

  test("Valid Password that match return true", async () => {
    const password = "123"
    const passwordValidationMessage = userValidator.getMessageForPassword(password)
    const hash = await hashPasswordService.execute(password)
    // Given
    expect(passwordValidationMessage).toBeNull()
    // When
    const isMatch = await comparePasswordHashService.execute(password, hash)
    // Then
    expect(isMatch).toBeTrue()
  })
})
