import "jest-extended"

import RequestValidatorImplementation from "../../../../src/domain/validators/implementations/request.validator"
import FakeTokenService from "../../../utils/fakes/fake-token.service"

import { MockTokenValidatorPlaceholder, MockTokenValidatorReturnMessage, MockTokenValidatorReturnNull } from "../../../utils/mocks/token-validator.mock"

// test("Null headers => Unauthorized", async () => {
//   const request = { body: validBody, headers: null, params: null }
//   // Given
//   expect(request.headers).toBeNull()
//   // When
//   const response = await ControllerFactory.getController(CreateTaskControllerImplementation).execute(request)
//   // Then
//   expect(response.status).toBe(401)
//   expect(response.body).toBeDefined()
//   expect(response.body).toBeString()
// })

// test("Headers not null but null token => Unathorized", async () => {
//   const headers = { authenticationToken: null }
//   const request = { body: validBody, headers, params: null }
//   // Given
//   expect(request.headers.authenticationToken).toBeNull()
//   // When
//   const response = await ControllerFactory.getController(CreateTaskControllerImplementation).execute(request)
//   // Then
//   expect(response.status).toBe(401)
//   expect(response.body).toBeDefined()
//   expect(response.body).toBeString()
// })

// test("Headers with expired token => Unathorized", async () => {
//   const headers = { authenticationToken: FakeTokenService.getExpired() }
//   let decodeErr: Error = undefined
//   try {
//     FakeTokenService.decode(headers.authenticationToken)
//   } catch (err) {
//     decodeErr = err
//   }
//   const request = { body: validBody, headers, params: null }
//   // Given
//   expect(decodeErr).toBeDefined()
//   expect(decodeErr).toBeInstanceOf(ExpiredTokenError)
//   // When
//   const response = await ControllerFactory.getController(CreateTaskControllerImplementation).execute(request)
//   // Then
//   expect(response.status).toBe(401)
//   expect(response.body).toBeDefined()
//   expect(response.body).toBeString()
// })
//
describe("RequestValidator | IsValidRequest", () => {
  test("Null request => false", () => {
    const request = null
    const tokenValidator = undefined
    // Given
    expect(request).toBeNull()
    expect(tokenValidator).toBeUndefined()
    // When
    const isValid = new RequestValidatorImplementation(tokenValidator).isValidRequest(request)
    // Then
    expect(isValid).toBeFalse()
  })

  test("Undefined request => false", () => {
    const request = undefined
    const tokenValidator = undefined
    // Given
    expect(request).not.toBeDefined()
    expect(tokenValidator).toBeUndefined()
    // When
    const isValid = new RequestValidatorImplementation(tokenValidator).isValidRequest(request)
    // Then
    expect(isValid).toBeFalse()
  })

  test("Not object request => false", () => {
    const request = 123
    const tokenValidator = undefined
    // Given
    expect(request).not.toBeObject()
    expect(tokenValidator).toBeUndefined()
    // When
    const isValid = new RequestValidatorImplementation(tokenValidator).isValidRequest(request)
    // Then
    expect(isValid).toBeFalse()
  })

  test("Undefined request.body => false", () => {
    const request = { headers: { token: "token" }, params: { myId: "myId" } }
    const tokenValidator = undefined
    // Given
    expect(request).not.toHaveProperty("body")
    expect(tokenValidator).toBeUndefined()
    // When
    const isValid = new RequestValidatorImplementation(tokenValidator).isValidRequest(request)
    // Then
    expect(isValid).toBeFalse()
  })

  test("Undefined request.headers => false", () => {
    const request = { body: { name: "myName" }, params: { myId: "myId" } }
    const tokenValidator = undefined
    // Given
    expect(request).not.toHaveProperty("headers")
    expect(tokenValidator).toBeUndefined()
    // When
    const isValid = new RequestValidatorImplementation(tokenValidator).isValidRequest(request)
    // Then
    expect(isValid).toBeFalse()
  })

  test("Undefined request.params => false", () => {
    const request = { body: { name: "myName" }, headers: { token: "token" } }
    const tokenValidator = undefined
    // Given
    expect(request).not.toHaveProperty("params")
    expect(tokenValidator).toBeUndefined()
    // When
    const isValid = new RequestValidatorImplementation(tokenValidator).isValidRequest(request)
    // Then
    expect(isValid).toBeFalse()
  })

  test("Valid request => true", () => {
    const request = {
      body: { name: "myName" },
      headers: { token: "token" },
      params: { myId: "myId" }
    }
    const tokenValidator = undefined
    // Given
    expect(request).toBeDefined()
    expect(request).not.toBeNull()
    expect(request).toBeObject()
    expect(request).toHaveProperty("body")
    expect(request).toHaveProperty("headers")
    expect(request).toHaveProperty("params")
    expect(tokenValidator).toBeUndefined()
    // When
    const isValid = new RequestValidatorImplementation(tokenValidator).isValidRequest(request)
    // Then
    expect(isValid).toBeTrue()
  })
})

describe("RequestValidator | getMessageForAuthenticationHeaders", () => {
  test("Undefined TokenValidator throws error", () => {
    const tokenValidator = undefined
    let validationErr: Error = undefined
    // Given
    expect(tokenValidator).toBeUndefined()
    expect(validationErr).toBeUndefined()
    // When
    try {
      const validator = new RequestValidatorImplementation(tokenValidator)
      validator.getMessageForAuthenticationHeaders(undefined)
    } catch (err) {
      validationErr = err
    }
    // Then
    expect(validationErr).toBeDefined()
    expect(validationErr.message).toBeTruthy()
    expect(validationErr.message).toBeString()
  })

  test("Null => message", () => {
    const headers = null
    const tokenValidator = new MockTokenValidatorReturnNull()
    // Given
    expect(headers).toBeNull()
    // When
    const validator = new RequestValidatorImplementation(tokenValidator)
    const validationMessage = validator.getMessageForAuthenticationHeaders(headers)
    // Then
    expect(validationMessage).toBeTruthy()
    expect(validationMessage).toBeString()
  })

  test("Undefined => message", () => {
    const headers = undefined
    const tokenValidator = new MockTokenValidatorReturnNull()
    // Given
    expect(headers).toBeUndefined()
    // When
    const validator = new RequestValidatorImplementation(tokenValidator)
    const validationMessage = validator.getMessageForAuthenticationHeaders(headers)
    // Then
    expect(validationMessage).toBeTruthy()
    expect(validationMessage).toBeString()
  })

  test("Not object => message", () => {
    const headers = 123
    const tokenValidator = new MockTokenValidatorReturnNull()
    // Given
    expect(headers).toBeTruthy()
    expect(headers).not.toBeObject()
    // When
    const validator = new RequestValidatorImplementation(tokenValidator)
    const validationMessage = validator.getMessageForAuthenticationHeaders(headers)
    // Then
    expect(validationMessage).toBeTruthy()
    expect(validationMessage).toBeString()
  })

  test("Null token => message", () => {
    const headers = { authenticationToken: null }
    const tokenValidator = new MockTokenValidatorReturnNull()
    // Given
    expect(headers).toBeTruthy()
    expect(headers.authenticationToken).toBeNull()
    // When
    const validator = new RequestValidatorImplementation(tokenValidator)
    const validationMessage = validator.getMessageForAuthenticationHeaders(headers)
    // Then
    expect(validationMessage).toBeTruthy()
    expect(validationMessage).toBeString()
  })

  test("Undefined token => message", () => {
    const headers = { authenticationToken: undefined }
    const tokenValidator = new MockTokenValidatorPlaceholder()
    // Given
    expect(headers).toBeTruthy()
    expect(headers.authenticationToken).toBeUndefined()
    // When
    const validator = new RequestValidatorImplementation(tokenValidator)
    const validationMessage = validator.getMessageForAuthenticationHeaders(headers)
    // Then
    expect(validationMessage).toBeTruthy()
    expect(validationMessage).toBeString()
  })

  test("Expired token => message", () => {
    const expiredToken = FakeTokenService.getExpired()
    const headers = { authenticationToken: expiredToken }
    const tokenValidator = new MockTokenValidatorReturnMessage()
    const mockMessage = tokenValidator.getMessageForToken(expiredToken)
    // Given
    expect(headers).toBeTruthy()
    expect(headers.authenticationToken).toBe(expiredToken)
    expect(mockMessage).toBeTruthy()
    expect(mockMessage).toBeString()
    // When
    const validator = new RequestValidatorImplementation(tokenValidator)
    const validationMessage = validator.getMessageForAuthenticationHeaders(headers)
    // Then
    expect(validationMessage).toBeTruthy()
    expect(validationMessage).toBeString()
  })

  test("Invalid token => message", () => {
    const invalidToken = FakeTokenService.getInvalid()
    const headers = { authenticationToken: invalidToken }
    const tokenValidator = new MockTokenValidatorReturnMessage()
    const mockMessage = tokenValidator.getMessageForToken(invalidToken)
    // Given
    expect(headers).toBeTruthy()
    expect(headers.authenticationToken).toBe(invalidToken)
    expect(mockMessage).toBeTruthy()
    expect(mockMessage).toBeString()
    // When
    const validator = new RequestValidatorImplementation(tokenValidator)
    const validationMessage = validator.getMessageForAuthenticationHeaders(headers)
    // Then
    expect(validationMessage).toBeTruthy()
    expect(validationMessage).toBeString()
  })

  test("Valid token => null", () => {
    const validToken = FakeTokenService.getValid()
    const headers = { authenticationToken: validToken }
    const tokenValidator = new MockTokenValidatorReturnNull()
    const mockMessage = tokenValidator.getMessageForToken(validToken)
    // Given
    expect(headers).toBeTruthy()
    expect(headers.authenticationToken).toBe(validToken)
    expect(mockMessage).toBeNull()
    // When
    const validator = new RequestValidatorImplementation(tokenValidator)
    const validationMessage = validator.getMessageForAuthenticationHeaders(headers)
    // Then
    expect(validationMessage).toBeNull()
  })
})
