import * as bcrypt from "bcryptjs"

import BcryptjsHashPasswordService from "../../../../../src/domain/services/auth/implementations/bcryptjs-hash-password.service"
import UserValidatorImplementation from "../../../../../src/domain/validators/implementations/user.validator"

import { expectsValidService } from "../../../../utils/functions/expects.functions"

describe("BcryptjsHashPasswordService | hashPassword", () => {
  test("Valid password => hash", async () => {
    const password = "foo"
    const hashPasswordService = new BcryptjsHashPasswordService()
    const userValidator = new UserValidatorImplementation()
    const passwordValidationMessage = userValidator.getMessageForPassword(password)
    // Given
    expect(password).toBeTruthy()
    expect(password).toBeString()
    expectsValidService(hashPasswordService)
    expect(passwordValidationMessage).toBeFalsy()
    // When
    const hash = await hashPasswordService.execute(password)
    // Then
    expect(hash).toBeTruthy()
    expect(hash).toBeString()
    const isMatch = await bcrypt.compare(password, hash)
    expect(isMatch).toBeTrue()
  })
})
