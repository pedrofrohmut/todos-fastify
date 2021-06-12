import "jest-extended"

import { FastifyReply, FastifyRequest } from "fastify"

import FastifyRouterBuilder from "../../../../src/fastify/router/implementations/fastify-router.builder"

import MockRequest from "../../../utils/mocks/fastify-request.mock"
import MockResponse from "../../../utils/mocks/fastify-response.mock"

let request: MockRequest
let response: MockResponse

beforeEach(() => {
  request = new MockRequest()
  response = new MockResponse()
})

const expectsValidResponse = (response?: FastifyReply): void => {
  expect(response).toBeDefined()
  expect(response).not.toBeNull()
  expect(response).toBeObject()
}

const expectsValidRequest = (request?: FastifyRequest): void => {
  expect(request).toBeDefined()
  expect(request).not.toBeNull()
  expect(request).toBeObject()
}

const expectsToHaveError = (err: Error): void => {
  expect(err).toBeTruthy()
  expect(err.message).toBeTruthy()
  expect(err.message).toBeString()
}

const getConstructorError = (request: any, response: any): null | Error => {
  try {
    // @ts-ignore
    new FastifyRouterBuilder(request, response)
    return null
  } catch (err) {
    return err
  }
}

const getBuildRouterError = (request: any, response: any): null | Error => {
  try {
    new FastifyRouterBuilder(request, response).buildRouter()
    return null
  } catch (err) {
    return err
  }
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
