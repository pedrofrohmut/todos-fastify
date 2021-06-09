import "jest-extended"

import ControllerUtil from "../../../src/utils/controllers/controller.util"
import { MockControllerStatusPayload } from "../../utils/mocks/controller.mock"
import MockRequest from "../../utils/mocks/fastify-request.mock"
import MockResponse from "../../utils/mocks/fastify-response.mock"

let request: MockRequest
let response: MockResponse

beforeEach(() => {
  request = new MockRequest()
  response = new MockResponse()
})

describe("ControllerUtil | Contructor", () => {
  test("Created with null request throws error", async () => {
    const request = null
    // Given
    expect(request).toBeNull()
    // When
    let constructErr: Error = undefined
    try {
      new ControllerUtil(request, response)
    } catch (err) {
      constructErr = err
    }
    // Then
    expect(constructErr).toBeDefined()
    expect(constructErr.message).toBeTruthy()
    expect(typeof constructErr.message === "string").toBeTrue()
  })

  test("Created with undefined request throws error", async () => {
    const request = undefined
    // Given
    expect(request).not.toBeDefined()
    // When
    let constructErr: Error = undefined
    try {
      new ControllerUtil(request, response)
    } catch (err) {
      constructErr = err
    }
    // Then
    expect(constructErr).toBeDefined()
    expect(constructErr.message).toBeTruthy()
    expect(typeof constructErr.message === "string").toBeTrue()
  })

  test("Create with null response throws error", () => {
    const response = null
    // Given
    expect(response).toBeNull()
    // When
    let constructErr: Error = undefined
    try {
      new ControllerUtil(request, response)
    } catch (err) {
      constructErr = err
    }
    // Then
    expect(constructErr).toBeDefined()
    expect(constructErr.message).toBeTruthy()
    expect(typeof constructErr.message === "string").toBeTrue()
  })

  test("Create with undefined response throws error", () => {
    const response = undefined
    // Given
    expect(response).not.toBeDefined()
    // When
    let constructErr: Error = undefined
    try {
      new ControllerUtil(request, response)
    } catch (err) {
      constructErr = err
    }
    // Then
    expect(constructErr).toBeDefined()
    expect(constructErr.message).toBeTruthy()
    expect(typeof constructErr.message === "string").toBeTrue()
  })
})

describe("ControllerExecutor | Success", () => {
  test("Returns 200 and body", async () => {
    const status = 200
    const body = { foo: "bar" }
    const mockController = new MockControllerStatusPayload(status, body)
    const mockResponse = await mockController.execute()
    // Given
    expect(mockResponse.status).toBe(status)
    expect(mockResponse.body).toEqual(body)
    // When
    await new ControllerUtil(request, response).workOn(mockController)
    // Then
    expect(response.statusCode).toBe(status)
    expect(response.payload).toEqual(body)
  })

  test("Returns 201 and no body", async () => {
    const status = 201
    const body = undefined
    const mockController = new MockControllerStatusPayload(status, body)
    const mockResponse = await mockController.execute()
    // Given
    expect(mockResponse.status).toBe(status)
    expect(mockResponse.body).not.toBeDefined()
    // When
    await new ControllerUtil(request, response).workOn(mockController)
    // Then
    expect(response.statusCode).toBe(status)
    expect(response.payload).toBeFalsy()
  })

  test("Returns 204 and no body", async () => {
    const status = 204
    const body = undefined
    const mockController = new MockControllerStatusPayload(status, body)
    const mockResponse = await mockController.execute()
    // Given
    expect(mockResponse.status).toBe(status)
    expect(mockResponse.body).not.toBeDefined()
    // When
    await new ControllerUtil(request, response).workOn(mockController)
    // Then
    expect(response.statusCode).toBe(status)
    expect(response.payload).toBeFalsy()
  })
})
