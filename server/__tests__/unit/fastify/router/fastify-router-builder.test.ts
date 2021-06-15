import "jest-extended"

import FastifyRouterBuilder from "../../../../src/fastify/router/implementations/fastify-router.builder"

import MockRequest from "../../../utils/mocks/fastify-request.mock"
import MockResponse from "../../../utils/mocks/fastify-response.mock"
import { expectsToHaveError } from "../../../utils/functions/expects.functions"
import { getSyncError } from "../../../utils/functions/error.functions"

let request: MockRequest
let response: MockResponse

beforeEach(() => {
  request = new MockRequest()
  response = new MockResponse()
})

const expectsValidResponse = (response: any): void => {
  expect(response).toBeTruthy()
  expect(response).toBeObject()
}

const expectsValidRequest = (request: any): void => {
  expect(request).toBeTruthy()
  expect(request).toBeObject()
}

const getConstructorError = (request: any, response: any): null | Error => {
  const possibleErr = getSyncError(() => {
    new FastifyRouterBuilder(request, response)
  })
  return possibleErr
}

const getBuildRouterError = (request: any, response: any): null | Error => {
  const possibleErr = getSyncError(() => {
    new FastifyRouterBuilder(request, response).buildRouter()
  })
  return possibleErr
}

describe("FastifyRouterBuilder | buildRouter", () => {
  test("Null request throws error", () => {
    const request = null
    // Given
    expect(request).toBeNull()
    expectsValidResponse(response)
    // When
    const constructorErr = getConstructorError(request, response)
    // Then
    expectsToHaveError(constructorErr)
  })

  test("Undefined request throws error", () => {
    const request = undefined
    // Given
    expect(request).toBeUndefined()
    expectsValidResponse(response)
    // When
    const constructorErr = getConstructorError(request, response)
    // Then
    expectsToHaveError(constructorErr)
  })

  test("Not typeof object request throws error", () => {
    const request = 123
    // Given
    expect(request).not.toBeObject()
    expectsValidResponse(response)
    // When
    const constructorErr = getConstructorError(request, response)
    // Then
    expectsToHaveError(constructorErr)
  })

  test("Null response throws error", () => {
    const response = null
    // Given
    expect(response).toBeNull()
    expectsValidRequest(request)
    // When
    const constructorErr = getConstructorError(request, response)
    // Then
    expectsToHaveError(constructorErr)
  })

  test("Undefined response throws error", () => {
    const response = undefined
    // Given
    expect(response).toBeUndefined()
    expectsValidRequest(request)
    // When
    const constructorErr = getConstructorError(request, response)
    // Then
    expectsToHaveError(constructorErr)
  })

  test("Not typeof object response throws error", () => {
    const response = 123
    // Given
    expect(response).not.toBeObject()
    expectsValidRequest(request)
    // When
    const constructorErr = getConstructorError(request, response)
    // Then
    expectsToHaveError(constructorErr)
  })

  test("No dependency errors build a router and return", () => {
    const constructorErr = getConstructorError(request, response)
    // Given
    expect(constructorErr).toBeFalsy()
    expectsValidRequest(request)
    expectsValidResponse(response)
    // When
    const buildErr = getBuildRouterError(request, response)
    // Then
    expect(buildErr).toBeFalsy()
  })
})
