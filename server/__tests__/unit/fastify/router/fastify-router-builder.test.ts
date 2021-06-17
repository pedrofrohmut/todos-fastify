import "jest-extended"

import FastifyRouterBuilder from "../../../../src/fastify/router/implementations/fastify-router.builder"

import DependencyInjectionError from "../../../../src/domain/errors/dependencies/dependency-injection.error"

import MockRequest from "../../../utils/mocks/fastify/fastify-request.mock"
import MockResponse from "../../../utils/mocks/fastify/fastify-response.mock"
import { expectsToHaveError } from "../../../utils/functions/expects.functions"
import { getSyncError } from "../../../utils/functions/error.functions"

const jwtSecret = process.env.JWT_SECRET

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

const expectsValidjwtSecret = (jwtSecret: string): void => {
  expect(jwtSecret).toBeTruthy()
  expect(jwtSecret).toBeString()
  expect(jwtSecret.length).toBeGreaterThanOrEqual(16)
}

describe("FastifyRouterBuilder | Constructor", () => {
  test("Null request throws error", () => {
    const request = null
    // Given
    expect(request).toBeNull()
    expectsValidResponse(response)
    expectsValidjwtSecret(jwtSecret)
    // When
    const constructorErr = getSyncError(
      () => new FastifyRouterBuilder(request, response, jwtSecret)
    )
    // Then
    expectsToHaveError(constructorErr)
    expect(constructorErr).toBeInstanceOf(DependencyInjectionError)
  })

  test("Undefined request throws error", () => {
    const request = undefined
    // Given
    expect(request).toBeUndefined()
    expectsValidResponse(response)
    expectsValidjwtSecret(jwtSecret)
    // When
    const constructorErr = getSyncError(
      () => new FastifyRouterBuilder(request, response, jwtSecret)
    )
    // Then
    expectsToHaveError(constructorErr)
  })

  test("Not typeof object request throws error", () => {
    const request = 123
    // Given
    expect(request).not.toBeObject()
    expectsValidResponse(response)
    expectsValidjwtSecret(jwtSecret)
    // When
    const constructorErr = getSyncError(
      // @ts-ignore
      () => new FastifyRouterBuilder(request, response, jwtSecret)
    )
    // Then
    expectsToHaveError(constructorErr)
    expect(constructorErr).toBeInstanceOf(DependencyInjectionError)
  })

  test("Null response throws error", () => {
    const response = null
    // Given
    expect(response).toBeNull()
    expectsValidRequest(request)
    expectsValidjwtSecret(jwtSecret)
    // When
    const constructorErr = getSyncError(
      () => new FastifyRouterBuilder(request, response, jwtSecret)
    )
    // Then
    expectsToHaveError(constructorErr)
    expect(constructorErr).toBeInstanceOf(DependencyInjectionError)
  })

  test("Undefined response throws error", () => {
    const response = undefined
    // Given
    expect(response).toBeUndefined()
    expectsValidRequest(request)
    expectsValidjwtSecret(jwtSecret)
    // When
    const constructorErr = getSyncError(
      () => new FastifyRouterBuilder(request, response, jwtSecret)
    )
    // Then
    expectsToHaveError(constructorErr)
    expect(constructorErr).toBeInstanceOf(DependencyInjectionError)
  })

  test("Not typeof object response throws error", () => {
    const response = 123
    // Given
    expect(response).not.toBeObject()
    expectsValidRequest(request)
    expectsValidjwtSecret(jwtSecret)
    // When
    const constructorErr = getSyncError(
      // @ts-ignore
      () => new FastifyRouterBuilder(request, response, jwtSecret)
    )
    // Then
    expectsToHaveError(constructorErr)
    expect(constructorErr).toBeInstanceOf(DependencyInjectionError)
  })

  test("No JWT_SECRET in the env throws error", () => {
    const jwtSecret = null
    // Given
    expect(jwtSecret).toBeFalsy()
    expectsValidRequest(request)
    expectsValidResponse(response)
    // When
    const constructorErr = getSyncError(
      () => new FastifyRouterBuilder(request, response, jwtSecret)
    )
    // Then
    expectsToHaveError(constructorErr)
    expect(constructorErr).toBeInstanceOf(DependencyInjectionError)
  })
})

describe("FastifyRouterBuilder | buildRouter", () => {
  test("No dependency errors build a router and return", () => {
    const constructorErr = getSyncError(
      () => new FastifyRouterBuilder(request, response, jwtSecret)
    )
    // Given
    expect(constructorErr).toBeFalsy()
    expectsValidRequest(request)
    expectsValidResponse(response)
    expectsValidjwtSecret(jwtSecret)
    // When
    const buildErr = getSyncError(() =>
      new FastifyRouterBuilder(request, response, jwtSecret).buildRouter()
    )
    // Then
    expect(buildErr).toBeFalsy()
  })
})
