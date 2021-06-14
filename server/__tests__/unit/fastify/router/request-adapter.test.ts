import "jest-extended"

import RequestAdapter from "../../../../src/fastify/router/request-adapter.interface"
import TokenDecoderService from "../../../../src/domain/services/auth/token-decoder-service.interface"

import FastifyRequestAdapter from "../../../../src/fastify/router/implementations/fastify-request.adapter"

import ExpiredTokenError from "../../../../src/domain/errors/auth/expired-token.error"
import InvalidTokenError from "../../../../src/domain/errors/auth/invalid-token.error"

import MockRequest from "../../../utils/mocks/fastify-request.mock"
import FakeTokenService from "../../../utils/fakes/fake-token.service"
import { MockDecoderService } from "../../../utils/mocks/services/decoder-service.mock"
import { isValidUUIDv4 } from "../../../utils/functions/validation-functions.util"
import FakeUserService from "../../../utils/fakes/fake-user.service"

const getAdaptError = (requestAdapter: RequestAdapter, request: any): null | Error => {
  try {
    requestAdapter.adapt(request)
    return null
  } catch (err) {
    return err
  }
}

const getDecodeError = (decoder: TokenDecoderService, token: string): null | Error => {
  try {
    decoder.execute(token)
    return null
  } catch (err) {
    return err
  }
}

const expectsToHaveError = (err: any): void => {
  expect(err).toBeDefined()
  expect(err).not.toBeNull()
  expect(err).toBeInstanceOf(Error)
  expect(err.message).toBeTruthy()
  expect(err.message).toBeString()
}

const expectsValidRequestAdapter = (requestAdapter: any): void => {
  expect(requestAdapter).toBeDefined()
  expect(requestAdapter).not.toBeNull()
  expect(requestAdapter).toBeObject()
  expect(requestAdapter).toBeInstanceOf(FastifyRequestAdapter)
}

const expectsValidDecoderService = (decoderService: any): void => {
  expect(decoderService).toBeDefined()
  expect(decoderService).not.toBeNull()
  expect(decoderService).toBeObject()
  expect(decoderService).toBeInstanceOf(MockDecoderService)
}

let request: MockRequest
let tokenDecoderService: TokenDecoderService
let requestAdapter: RequestAdapter

beforeEach(() => {
  request = new MockRequest()
  tokenDecoderService = new MockDecoderService()
  requestAdapter = new FastifyRequestAdapter(tokenDecoderService)
})

describe("RequestAdapter | adapt | invalid request", () => {
  test("Null request throws error", () => {
    const request = null
    // Given
    expect(request).toBeNull()
    expectsValidDecoderService(tokenDecoderService)
    expectsValidRequestAdapter(requestAdapter)
    // When
    const adaptErr = getAdaptError(requestAdapter, request)
    // Then
    expectsToHaveError(adaptErr)
  })

  test("Undefined request throws error", () => {
    const request = undefined
    // Given
    expect(request).toBeUndefined()
    expectsValidDecoderService(tokenDecoderService)
    expectsValidRequestAdapter(requestAdapter)
    // When
    const adaptErr = getAdaptError(requestAdapter, request)
    // Then
    expectsToHaveError(adaptErr)
  })

  test("Not typeof object throws error", () => {
    const request = 123
    // Given
    expect(request).not.toBeObject()
    expectsValidDecoderService(tokenDecoderService)
    expectsValidRequestAdapter(requestAdapter)
    // When
    const adaptErr = getAdaptError(requestAdapter, request)
    // Then
    expectsToHaveError(adaptErr)
  })
})

describe("RequestAdapter | adapt | adapt body", () => {
  test("Null body => null request.body", () => {
    request.body = null
    const adaptErr = getAdaptError(requestAdapter, request)
    // Given
    expect(request.body).toBeNull()
    expect(adaptErr).toBeFalsy()
    expectsValidDecoderService(tokenDecoderService)
    expectsValidRequestAdapter(requestAdapter)
    // When
    const adaptedRequest = requestAdapter.adapt(request)
    // Then
    expect(adaptedRequest.body).toBeNull()
  })

  test("Undefined => null request.body", () => {
    request.body = undefined
    const adaptErr = getAdaptError(requestAdapter, request)
    // Given
    expect(request.body).toBeUndefined()
    expect(adaptErr).toBeFalsy()
    expectsValidDecoderService(tokenDecoderService)
    expectsValidRequestAdapter(requestAdapter)
    // When
    const adaptedRequest = requestAdapter.adapt(request)
    // Then
    expect(adaptedRequest.body).toBeNull()
  })

  test("Not typeof object throws error", () => {
    request.body = 123
    // Given
    expect(request.body).not.toBeObject()
    expectsValidDecoderService(tokenDecoderService)
    expectsValidRequestAdapter(requestAdapter)
    // When
    const adaptErr = getAdaptError(requestAdapter, request)
    // Then
    expectsToHaveError(adaptErr)
  })

  test("Valid body => body", () => {
    const body = { foo: "bar" }
    request.body = body
    // Given
    expect(request.body).toBeDefined()
    expect(request.body).not.toBeNull()
    expect(request.body).toBeObject()
    expect(request.body).toEqual(body)
    expectsValidDecoderService(tokenDecoderService)
    expectsValidRequestAdapter(requestAdapter)
    // When
    const adaptedRequest = requestAdapter.adapt(request)
    // Then
    expect(adaptedRequest.body).toEqual(body)
  })
})

describe("RequestAdapter | adapt | adapt params", () => {
  test("Null params => null request.params", () => {
    request.params = null
    const adaptErr = getAdaptError(requestAdapter, request)
    // Given
    expect(request.params).toBeNull()
    expect(adaptErr).toBeFalsy()
    expectsValidDecoderService(tokenDecoderService)
    expectsValidRequestAdapter(requestAdapter)
    // When
    const adaptedRequest = requestAdapter.adapt(request)
    // Then
    expect(adaptedRequest.params).toBeNull()
  })

  test("Undefined params => null request.params", () => {
    request.params = undefined
    const adaptErr = getAdaptError(requestAdapter, request)
    // Given
    expect(request.params).toBeUndefined()
    expect(adaptErr).toBeFalsy()
    expectsValidDecoderService(tokenDecoderService)
    expectsValidRequestAdapter(requestAdapter)
    // When
    const adaptedRequest = requestAdapter.adapt(request)
    // Then
    expect(adaptedRequest.params).toBeNull()
  })

  test("Not typeof object throws error", () => {
    request.params = 123
    // Given
    expect(request.params).not.toBeObject()
    expectsValidDecoderService(tokenDecoderService)
    expectsValidRequestAdapter(requestAdapter)
    // When
    const adaptErr = getAdaptError(requestAdapter, request)
    // Then
    expectsToHaveError(adaptErr)
  })

  test("Valid params => params", () => {
    const params = { foo: "bar" }
    request.params = params
    const adaptErr = getAdaptError(requestAdapter, request)
    // Given
    expect(request.params).toBeDefined()
    expect(request.params).not.toBeNull()
    expect(request.params).toBeObject()
    expect(request.params).toEqual(params)
    expect(adaptErr).toBeFalsy()
    expectsValidDecoderService(tokenDecoderService)
    expectsValidRequestAdapter(requestAdapter)
    // When
    const adaptedRequest = requestAdapter.adapt(request)
    // Then
    expect(adaptedRequest.params).toEqual(params)
  })
})

describe("RequestAdapter | adapt | headers to authUserId", () => {
  test("Null headers => null authUserId", () => {
    request.headers = null
    const adaptErr = getAdaptError(requestAdapter, request)
    // Given
    expect(request.headers).toBeNull()
    expect(adaptErr).toBeFalsy()
    expectsValidDecoderService(tokenDecoderService)
    expectsValidRequestAdapter(requestAdapter)
    // When
    const adaptedRequest = requestAdapter.adapt(request)
    // Then
    expect(adaptedRequest.authUserId).toBeNull()
  })

  test("Undefined headers => null authUserId", () => {
    request.headers = undefined
    const adaptErr = getAdaptError(requestAdapter, request)
    // Given
    expect(request.headers).toBeUndefined()
    expect(adaptErr).toBeFalsy()
    expectsValidDecoderService(tokenDecoderService)
    expectsValidRequestAdapter(requestAdapter)
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
    expectsValidDecoderService(tokenDecoderService)
    expectsValidRequestAdapter(requestAdapter)
    // When
    const adaptErr = getAdaptError(requestAdapter, request)
    // Then
    expectsToHaveError(adaptErr)
  })

  test("Null token => null authUserId", () => {
    request.headers.authentication_token = null
    const adaptErr = getAdaptError(requestAdapter, request)
    // Given
    expect(request.headers).toBeTruthy()
    expect(request.headers).toBeObject()
    expect(request.headers.authentication_token).toBeNull()
    expect(adaptErr).toBeFalsy()
    expectsValidDecoderService(tokenDecoderService)
    expectsValidRequestAdapter(requestAdapter)
    // When
    const adaptedRequest = requestAdapter.adapt(request)
    // Then
    expect(adaptedRequest.authUserId).toBeNull()
  })

  test("Undefined token => null authUserId", () => {
    request.headers.authentication_token = undefined
    const adaptErr = getAdaptError(requestAdapter, request)
    // Given
    expect(request.headers).toBeTruthy()
    expect(request.headers).toBeObject()
    expect(request.headers.authentication_token).toBeUndefined()
    expect(adaptErr).toBeFalsy()
    expectsValidDecoderService(tokenDecoderService)
    expectsValidRequestAdapter(requestAdapter)
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
    expectsValidDecoderService(tokenDecoderService)
    expectsValidRequestAdapter(requestAdapter)
    // When
    const adaptErr = getAdaptError(requestAdapter, request)
    // Then
    expect(adaptErr).toBeTruthy()
  })

  test("Expired token throws error", () => {
    request.headers.authentication_token = FakeTokenService.getExpired()
    const decodeErr = getDecodeError(tokenDecoderService, request.headers.authentication_token)
    // Given
    expect(request.headers).toBeTruthy()
    expect(request.headers).toBeObject()
    expect(request.headers.authentication_token).toBeString()
    expectsToHaveError(decodeErr)
    expect(decodeErr).toBeInstanceOf(ExpiredTokenError)
    expectsValidDecoderService(tokenDecoderService)
    expectsValidRequestAdapter(requestAdapter)
    // When
    const adaptErr = getAdaptError(requestAdapter, request)
    // Then
    expectsToHaveError(adaptErr)
  })

  test("Invalid token throws error", () => {
    request.headers.authentication_token = FakeTokenService.getInvalid()
    const decodeErr = getDecodeError(tokenDecoderService, request.headers.authentication_token)
    // Given
    expect(request.headers).toBeTruthy()
    expect(request.headers).toBeObject()
    expect(request.headers.authentication_token).toBeString()
    expectsToHaveError(decodeErr)
    expect(decodeErr).toBeInstanceOf(InvalidTokenError)
    expectsValidDecoderService(tokenDecoderService)
    expectsValidRequestAdapter(requestAdapter)
    // When
    const adaptErr = getAdaptError(requestAdapter, request)
    // Then
    expectsToHaveError(adaptErr)
  })

  test("Valid token and not valid userId throws error", () => {
    request.headers.authentication_token = FakeTokenService.getValid("123")
    const decodeErr = getDecodeError(tokenDecoderService, request.headers.authentication_token)
    const { userId } = tokenDecoderService.execute(request.headers.authentication_token)
    // Given
    expect(request.headers).toBeTruthy()
    expect(request.headers).toBeObject()
    expect(request.headers.authentication_token).toBeString()
    expect(decodeErr).toBeFalsy()
    expect(userId).toBeTruthy()
    expect(userId).toBeString()
    expectsValidDecoderService(tokenDecoderService)
    expectsValidRequestAdapter(requestAdapter)
    // When
    const adaptErr = getAdaptError(requestAdapter, request)
    // Then
    expectsToHaveError(adaptErr)
  })

  test("Valid headers, valid token and valid userId => authUserId", () => {
    const id = FakeUserService.getValidUserId()
    request.headers.authentication_token = FakeTokenService.getValid(id)
    const decodeErr = getDecodeError(tokenDecoderService, request.headers.authentication_token)
    const { userId } = tokenDecoderService.execute(request.headers.authentication_token)
    const adaptErr = getAdaptError(requestAdapter, request)
    // Given
    expect(request.headers).toBeTruthy()
    expect(request.headers).toBeObject()
    expect(request.headers.authentication_token).toBeTruthy()
    expect(request.headers.authentication_token).toBeString()
    expect(decodeErr).toBeFalsy()
    expect(userId).toBeTruthy()
    expect(userId).toBeString()
    expect(userId).toBe(id)
    expect(isValidUUIDv4(userId)).toBeTrue()
    expect(adaptErr).toBeFalsy()
    expectsValidDecoderService(tokenDecoderService)
    expectsValidRequestAdapter(requestAdapter)
    // When
    const adaptedRequest = requestAdapter.adapt(request)
    // Then
    expect(adaptedRequest.authUserId).toBeTruthy()
    expect(adaptedRequest.authUserId).toBe(id)
  })
})
