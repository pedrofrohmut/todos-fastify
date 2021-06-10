import "jest-extended"

import TokenValidatorImplementation from "../../../../src/domain/validators/implementations/token.validator"

import {
  MockDecoderTokenServiceNoExecute,
  MockDecoderTokenServicePlaceholder,
  MockDecoderTokenServiceThrowsExpired,
  MockDecoderTokenServiceThrowsInvalid
} from "../../../utils/mocks/decoder-token-service.mock"

import FakeTokenService from "../../../utils/fakes/fake-token.service"

describe("TokenValidator | GetMessageForToken", () => {
  const getInstantiateErrorTokenValidator = (service?: any) => {
    try {
      new TokenValidatorImplementation(service)
    } catch (err) {
      return err
    }
  }

  const expectsToHaveError = (err: Error) => {
    expect(err).toBeDefined()
    expect(err.message).toBeTruthy()
    expect(err.message).toBeString()
  }

  const expectsValidService = (service?: any) => {
    expect(service).toBeDefined()
    expect(service).not.toBeNull()
    expect(service.execute).toBeDefined()
  }

  const getValidationMessageForToken = (decoderService?: any, token?: any) => {
    const validator = new TokenValidatorImplementation(decoderService)
    return validator.getMessageForToken(token)
  }

  const expectsInvalidToken = (validationMessage: string | null) => {
    expect(validationMessage).toBeDefined()
    expect(validationMessage).toBeTruthy()
    expect(validationMessage).toBeString()
  }

  test("Null dependency decoder service throw error", () => {
    const decoderService = null
    // Given
    expect(decoderService).toBeNull()
    // When
    const constructErr = getInstantiateErrorTokenValidator(decoderService)
    // Then
    expectsToHaveError(constructErr)
  })

  test("Undefined dependency decoder service throw error", () => {
    const decoderService = undefined
    // Given
    expect(decoderService).toBeUndefined()
    // When
    const constructErr = getInstantiateErrorTokenValidator(decoderService)
    // Then
    expectsToHaveError(constructErr)
  })

  test("Decoder service dependency do not have execute throw error", () => {
    const decoderService = new MockDecoderTokenServiceNoExecute()
    // Given
    // @ts-ignore
    expect(decoderService.execute).toBeUndefined()
    // When
    const constructErr = getInstantiateErrorTokenValidator(decoderService)
    // Then
    expectsToHaveError(constructErr)
  })

  test("Null => message", () => {
    const decoderService = new MockDecoderTokenServicePlaceholder()
    const token = null
    // Given
    expectsValidService(decoderService)
    expect(token).toBeNull()
    // When
    const validationMessage = getValidationMessageForToken(decoderService, token)
    // Then
    expectsInvalidToken(validationMessage)
  })

  test("Undefined => message", () => {
    const decoderService = new MockDecoderTokenServicePlaceholder()
    const token = undefined
    // Given
    expectsValidService(decoderService)
    expect(token).toBeUndefined()
    // When
    const validationMessage = getValidationMessageForToken(decoderService, token)
    // Then
    expectsInvalidToken(validationMessage)
  })

  test("Not String => message", () => {
    const decoderService = new MockDecoderTokenServicePlaceholder()
    const token = 123
    // Given
    expectsValidService(decoderService)
    expect(token).not.toBeString()
    // When
    const validationMessage = getValidationMessageForToken(decoderService, token)
    // Then
    expectsInvalidToken(validationMessage)
  })

  test("Expired => message", () => {
    const decoderService = new MockDecoderTokenServiceThrowsExpired()
    const token = FakeTokenService.getValid()
    // Given
    expectsValidService(decoderService)
    expect(token).toBeDefined()
    expect(token).not.toBeNull()
    expect(token).toBeString()
    // When
    const validationMessage = getValidationMessageForToken(decoderService, token)
    // Then
    expectsInvalidToken(validationMessage)
  })

  test("Invalid => message", () => {
    const decoderService = new MockDecoderTokenServiceThrowsInvalid()
    const token = FakeTokenService.getValid()
    // Given
    expectsValidService(decoderService)
    expect(token).toBeDefined()
    expect(token).not.toBeNull()
    expect(token).toBeString()
    // When
    const validationMessage = getValidationMessageForToken(decoderService, token)
    // Then
    expectsInvalidToken(validationMessage)
  })

  test("Valid => null", () => {
    const decoderService = new MockDecoderTokenServicePlaceholder()
    const token = FakeTokenService.getValid()
    // Given
    expectsValidService(decoderService)
    expect(token).toBeDefined()
    expect(token).not.toBeNull()
    expect(token).toBeString()
    // When
    const validationMessage = getValidationMessageForToken(decoderService, token)
    // Then
    expect(validationMessage).toBeNull()
  })
})
