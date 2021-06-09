import "jest-extended"

import RequestAdapter from "../../../src/utils/controllers/request.adaptor"

import MockRequest from "../../utils/mocks/fastify-request.mock"

let request: MockRequest

beforeEach(() => {
  request = new MockRequest()
})

describe("RequestAdapter | Body", () => {
  test("Invalid body throws error", async () => {
    request.body = 123
    //  Given
    expect(typeof request.body === "object").toBeFalse()
    // When
    let adaptErr: Error = undefined
    try {
      RequestAdapter.adapt(request)
    } catch (err) {
      adaptErr = err
    }
    // Then
    expect(adaptErr).toBeDefined()
    expect(adaptErr.message).toBeTruthy()
  })

  test("Null body returns null body", async () => {
    request.body = null
    // Given
    expect(request.body).toBeNull()
    // When
    const adapted = RequestAdapter.adapt(request)
    // Then
    expect(adapted.body).toBeNull()
  })

  test("Undefined body returns null body", async () => {
    request.body = undefined
    // Given
    expect(request.body).not.toBeDefined()
    // When
    const adapted = RequestAdapter.adapt(request)
    // Then
    expect(adapted.body).toBeNull()
  })

  test("Empty object returns null body", async () => {
    request.body = {}
    // Given
    expect(request.body).toEqual({})
    // When
    const adapted = RequestAdapter.adapt(request)
    // Then
    expect(adapted.body).toBeNull()
  })

  test("Body typeof object not empty returns passed body", async () => {
    const body = { foo: "bar" }
    request.body = body
    // Given
    expect(request.body).toEqual(body)
    // When
    const adapted = RequestAdapter.adapt(request)
    // Then
    expect(adapted.body).toEqual(body)
  })
})

describe("RequestAdapter | Headers", () => {
  test("Invalid headers throws error", () => {
    // @ts-ignore
    request.headers = 123
    // Given
    expect(typeof request.headers === "object").toBeFalse()
    // When
    let adaptErr: Error = undefined
    try {
      RequestAdapter.adapt(request)
    } catch (err) {
      adaptErr = err
    }
    // Then
    expect(adaptErr).toBeDefined()
    expect(adaptErr.message).toBeTruthy()
  })

  test("Invalid authentication_token throws error", async () => {
    // @ts-ignore
    request.headers.authentication_token = 123
    // Given
    expect(typeof request.headers.authentication_token === "string").toBeFalse()
    // When
    let adaptErr: Error = undefined
    try {
      RequestAdapter.adapt(request)
    } catch (err) {
      adaptErr = err
    }
    // Then
    expect(adaptErr).toBeDefined()
    expect(adaptErr.message).toBeTruthy()
  })

  test("Null headers return null headers", async () => {
    request.headers = null
    // Given
    expect(request.headers).toBeNull()
    // When
    const adapted = RequestAdapter.adapt(request)
    // Then
    expect(adapted.headers).toBeNull()
  })

  test("Valid authentication_token headers return adapted headers", async () => {
    request.headers = { authentication_token: "TOKEN" }
    // Given
    expect(request.headers).toEqual({ authentication_token: "TOKEN" })
    // When
    const adapted = RequestAdapter.adapt(request)
    // Then
    expect(adapted.headers).toEqual({ authenticationToken: "TOKEN" })
  })
})

describe("RequestAdapter | Params", () => {
  test("Invalid request params throws error", async () => {
    request.params = 123
    // Given
    expect(typeof request.params === "object").toBeFalse()
    // When
    let adaptErr: Error = undefined
    try {
      RequestAdapter.adapt(request)
    } catch (err) {
      adaptErr = err
    }
    // Then
    expect(adaptErr).toBeDefined()
    expect(adaptErr.message).toBeTruthy()
  })

  test("Null params returns null params", async () => {
    request.params = null
    // Given
    expect(request.params).toBeNull()
    // When
    const adapted = RequestAdapter.adapt(request)
    // Then
    expect(adapted.params).toBeNull()
  })

  test("Undefined params returns null params", async () => {
    request.params = undefined
    // Given
    expect(request.params).not.toBeDefined()
    // When
    const adapted = RequestAdapter.adapt(request)
    // Then
    expect(adapted.params).toBeNull()
  })

  test("Empty object returns null params", async () => {
    request.params = {}
    // Given
    expect(request.params).toEqual({})
    // When
    const adapted = RequestAdapter.adapt(request)
    // Then
    expect(adapted.params).toBeNull()
  })

  test("Valid params returns equal params", async () => {
    const foo = { foo: "bar" }
    request.params = foo
    // Given
    expect(request.params).toEqual(foo)
    // When
    const adapted = RequestAdapter.adapt(request)
    // Then
    expect(adapted.params).toEqual(foo)
  })
})
