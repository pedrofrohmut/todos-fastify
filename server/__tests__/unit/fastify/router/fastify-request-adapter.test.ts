import "jest-extended"

import UserValidatorImplementation from "../../../../src/domain/validators/implementations/user.validator"
import FastifyRequestAdapter from "../../../../src/fastify/router/implementations/fastify-request.adapter"
import JwtDecodeTokenService from "../../../../src/domain/services/auth/implementations/jwt-decode-token.service"

import ExpiredTokenError from "../../../../src/domain/errors/auth/expired-token.error"
import InvalidTokenError from "../../../../src/domain/errors/auth/invalid-token.error"

import FakeTokenService from "../../../utils/fakes/token-service.fake"
import FakeUserService from "../../../utils/fakes/user-service.fake"
import { getSyncError } from "../../../utils/functions/error.functions"
import { expectsToHaveError } from "../../../utils/functions/expects.functions"
import MockRequest from "../../../utils/mocks/fastify/fastify-request.mock"

const decodeTokenService = new JwtDecodeTokenService(process.env.JWT_SECRET)
const requestAdapter = new FastifyRequestAdapter(decodeTokenService)
const userValidator = new UserValidatorImplementation()

let request: MockRequest

beforeEach(() => {
  request = new MockRequest()
})

describe("FastifyRequestAdapter | adapt | invalid request", () => {
  test("Null request throws error", () => {
    const request = null
    // Given
    expect(request).toBeNull()
    // When
    const adaptErr = getSyncError(() => requestAdapter.adapt(request))
    // Then
    expectsToHaveError(adaptErr)
  })

  test("Undefined request throws error", () => {
    const request = undefined
    // Given
    expect(request).toBeUndefined()
    // When
    const adaptErr = getSyncError(() => requestAdapter.adapt(request))
    // Then
    expectsToHaveError(adaptErr)
  })

  test("Not typeof object throws error", () => {
    const request = 123
    // Given
    expect(request).not.toBeObject()
    // When
    // @ts-ignore
    const adaptErr = getSyncError(() => requestAdapter.adapt(request))
    // Then
    expectsToHaveError(adaptErr)
  })
})

describe("FastifyRequestAdapter | adapt | adapt body", () => {
  test("Null body => null request.body", () => {
    request.body = null
    const adaptErr = getSyncError(() => requestAdapter.adapt(request))
    // Given
    expect(request.body).toBeNull()
    expect(adaptErr).toBeFalsy()
    // When
    const adaptedRequest = requestAdapter.adapt(request)
    // Then
    expect(adaptedRequest.body).toBeNull()
  })

  test("Undefined => null request.body", () => {
    request.body = undefined
    const adaptErr = getSyncError(() => requestAdapter.adapt(request))
    // Given
    expect(request.body).toBeUndefined()
    expect(adaptErr).toBeFalsy()
    // When
    const adaptedRequest = requestAdapter.adapt(request)
    // Then
    expect(adaptedRequest.body).toBeNull()
  })

  test("Not typeof object throws error", () => {
    request.body = 123
    // Given
    expect(request.body).not.toBeObject()
    // When
    const adaptErr = getSyncError(() => requestAdapter.adapt(request))
    // Then
    expectsToHaveError(adaptErr)
  })

  test("Valid body => body", () => {
    const body = { foo: "bar" }
    request.body = body
    // Given
    expect(request.body).not.toBeNull()
    expect(request.body).toEqual(body)
    // When
    const adaptedRequest = requestAdapter.adapt(request)
    // Then
    expect(adaptedRequest.body).toEqual(body)
  })
})

describe("FastifyRequestAdapter | adapt | adapt params", () => {
  test("Null params => null request.params", () => {
    request.params = null
    const adaptErr = getSyncError(() => requestAdapter.adapt(request))
    // Given
    expect(request.params).toBeNull()
    expect(adaptErr).toBeFalsy()
    // When
    const adaptedRequest = requestAdapter.adapt(request)
    // Then
    expect(adaptedRequest.params).toBeNull()
  })

  test("Undefined params => null request.params", () => {
    request.params = undefined
    const adaptErr = getSyncError(() => requestAdapter.adapt(request))
    // Given
    expect(request.params).toBeUndefined()
    expect(adaptErr).toBeFalsy()
    // When
    const adaptedRequest = requestAdapter.adapt(request)
    // Then
    expect(adaptedRequest.params).toBeNull()
  })

  test("Not typeof object throws error", () => {
    request.params = 123
    // Given
    expect(request.params).not.toBeObject()
    // When
    const adaptErr = getSyncError(() => requestAdapter.adapt(request))
    // Then
    expectsToHaveError(adaptErr)
  })

  test("Valid params => params", () => {
    const params = { foo: "bar" }
    request.params = params
    const adaptErr = getSyncError(() => requestAdapter.adapt(request))
    // Given
    expect(request.params).toEqual(params)
    expect(adaptErr).toBeFalsy()
    // When
    const adaptedRequest = requestAdapter.adapt(request)
    // Then
    expect(adaptedRequest.params).toEqual(params)
  })
})

describe("FastifyRequestAdapter | adapt | headers to authUserId", () => {
  test("Null headers => null authUserId", () => {
    request.headers = null
    const adaptErr = getSyncError(() => requestAdapter.adapt(request))
    // Given
    expect(request.headers).toBeNull()
    expect(adaptErr).toBeFalsy()
    // When
    const adaptedRequest = requestAdapter.adapt(request)
    // Then
    expect(adaptedRequest.authUserId).toBeNull()
  })

  test("Undefined headers => null authUserId", () => {
    request.headers = undefined
    const adaptErr = getSyncError(() => requestAdapter.adapt(request))
    // Given
    expect(request.headers).toBeUndefined()
    expect(adaptErr).toBeFalsy()
    // When
    const adaptedRequest = requestAdapter.adapt(request)
    // Then
    expect(adaptedRequest.authUserId).toBeNull()
  })

  test("Not typeof object headers throws error", () => {
    // @ts-ignore
    request.headers = 123
    // Given
    expect(request.headers).toBeTruthy()
    expect(request.headers).not.toBeObject()
    // When
    const adaptErr = getSyncError(() => requestAdapter.adapt(request))
    // Then
    expectsToHaveError(adaptErr)
  })

  test("Null token => null authUserId", () => {
    request.headers.authentication_token = null
    const adaptErr = getSyncError(() => requestAdapter.adapt(request))
    // Given
    expect(request.headers).toBeTruthy()
    expect(request.headers).toBeObject()
    expect(request.headers.authentication_token).toBeNull()
    expect(adaptErr).toBeFalsy()
    // When
    const adaptedRequest = requestAdapter.adapt(request)
    // Then
    expect(adaptedRequest.authUserId).toBeNull()
  })

  test("Undefined token => null authUserId", () => {
    request.headers.authentication_token = undefined
    const adaptErr = getSyncError(() => requestAdapter.adapt(request))
    // Given
    expect(request.headers).toBeTruthy()
    expect(request.headers).toBeObject()
    expect(request.headers.authentication_token).toBeUndefined()
    expect(adaptErr).toBeFalsy()
    // When
    const adaptedRequest = requestAdapter.adapt(request)
    // Then
    expect(adaptedRequest.authUserId).toBeNull()
  })

  test("Not typeof string authToken throws error", () => {
    // @ts-ignore
    request.headers.authentication_token = 123
    // Given
    expect(request.headers).toBeTruthy()
    expect(request.headers).toBeObject()
    expect(request.headers.authentication_token).not.toBeString()
    // When
    const adaptErr = getSyncError(() => requestAdapter.adapt(request))
    // Then
    expect(adaptErr).toBeTruthy()
  })

  test("Expired token throws error", () => {
    request.headers.authentication_token = FakeTokenService.getExpired()
    const decodeErr = getSyncError(() =>
      decodeTokenService.execute(request.headers.authentication_token as string)
    )
    // Given
    expect(request.headers).toBeTruthy()
    expect(request.headers).toBeObject()
    expect(request.headers.authentication_token).toBeString()
    expectsToHaveError(decodeErr)
    expect(decodeErr).toBeInstanceOf(ExpiredTokenError)
    // When
    const adaptErr = getSyncError(() => requestAdapter.adapt(request))
    // Then
    expectsToHaveError(adaptErr)
  })

  test("Invalid token throws error", () => {
    request.headers.authentication_token = FakeTokenService.getInvalid()
    const decodeErr = getSyncError(() =>
      decodeTokenService.execute(request.headers.authentication_token as string)
    )
    // Given
    expect(request.headers).toBeTruthy()
    expect(request.headers).toBeObject()
    expect(request.headers.authentication_token).toBeString()
    expectsToHaveError(decodeErr)
    expect(decodeErr).toBeInstanceOf(InvalidTokenError)
    // When
    const adaptErr = getSyncError(() => requestAdapter.adapt(request))
    // Then
    expectsToHaveError(adaptErr)
  })

  test("Valid token and not valid userId throws error", () => {
    request.headers.authentication_token = FakeTokenService.getValid("123")
    const decodeErr = getSyncError(() =>
      decodeTokenService.execute(request.headers.authentication_token as string)
    )
    const { userId } = decodeTokenService.execute(request.headers.authentication_token)
    const userIdValidationMessage = userValidator.getMessageForId(userId)
    // Given
    expect(request.headers).toBeTruthy()
    expect(request.headers).toBeObject()
    expect(request.headers.authentication_token).toBeString()
    expect(decodeErr).toBeFalsy()
    expect(userIdValidationMessage).toBeTruthy()
    // When
    const adaptErr = getSyncError(() => requestAdapter.adapt(request))
    // Then
    expectsToHaveError(adaptErr)
  })

  test("Valid headers, valid token and valid userId => authUserId", () => {
    const id = FakeUserService.getValidUserId()
    request.headers.authentication_token = FakeTokenService.getValid(id)
    const adaptErr = getSyncError(() => requestAdapter.adapt(request))
    const decodeErr = getSyncError(() =>
      decodeTokenService.execute(request.headers.authentication_token as string)
    )
    const { userId } = decodeTokenService.execute(request.headers.authentication_token)
    const userIdValidationMessage = userValidator.getMessageForId(userId)
    // Given
    expect(request.headers).toBeTruthy()
    expect(request.headers).toBeObject()
    expect(request.headers.authentication_token).toBeTruthy()
    expect(request.headers.authentication_token).toBeString()
    expect(adaptErr).toBeFalsy()
    expect(decodeErr).toBeFalsy()
    expect(userIdValidationMessage).toBeNull()
    // When
    const adaptedRequest = requestAdapter.adapt(request)
    // Then
    expect(adaptedRequest.authUserId).toBeTruthy()
    expect(adaptedRequest.authUserId).toBe(id)
  })
})
