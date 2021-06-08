import "jest-extended"

import ControllerExecutorImplementation from "../../../../src/domain/controllers/controller.util"

import CreateTaskControllerImplementation from "../../../../src/domain/controllers/tasks/implementations/create-task.controller"

import {
  MockControllerArgsAsResponse,
  MockControllerRequestAsPayload,
  MockControllerStatusPayload
} from "../../../utils/mocks/controller.mock"
import MockRequest from "../../../utils/mocks/fastify-request.mock"

let request: MockRequest

beforeEach(() => {
  request = new MockRequest()
})

describe("ControllerExecutor | AdaptRequest", () => {
  test("Execute with invalid request body returns 400 and message", async () => {
    request.body = 123
    const controllerExecutor = new ControllerExecutorImplementation(request)
    const response = await controllerExecutor.workOn(CreateTaskControllerImplementation)
    expect(response.status).toBe(400)
    expect(response.body).toBeTruthy()
    expect(typeof response.body === "string").toBeTrue()
  })

  test("Execute with null request body returns 200 and { body: null }", async () => {
    request.body = null
    const controllerExecutor = new ControllerExecutorImplementation(request)
    const response = await controllerExecutor.workOn(new MockControllerRequestAsPayload(200))
    expect(response.status).toBe(200)
    expect(response.body.body).toBeNull()
  })

  test("Execute with valid body returns 200 and valid body", async () => {
    request.body = { foo: "bar" }
    const controllerExecutor = new ControllerExecutorImplementation(request)
    const response = await controllerExecutor.workOn(new MockControllerRequestAsPayload(200))
    expect(response.status).toBe(200)
    expect(response.body.body).toEqual({ foo: "bar" })
  })

  test("Execute with invalid request headers returns 400 and message", async () => {
    request.headers.authentication_token = ["foo", "bar", "baz"]
    const controllerExecutor = new ControllerExecutorImplementation(request)
    const response = await controllerExecutor.workOn(CreateTaskControllerImplementation)
    expect(response.status).toBe(400)
    expect(response.body).toBeTruthy()
    expect(typeof response.body === "string").toBeTrue()
  })

  test("Execute with null request headers returns 200 and { headers: null }", async () => {
    request.headers.authentication_token = null
    const controllerExecutor = new ControllerExecutorImplementation(request)
    const response = await controllerExecutor.workOn(new MockControllerRequestAsPayload(200))
    expect(response.status).toBe(200)
    expect(response.body.headers).toBeNull()
  })

  test("Execute with valid request headers returns 200 and { authenticationToken: '...' }", async () => {
    request.headers.authentication_token = "TOKEN"
    const controllerExecutor = new ControllerExecutorImplementation(request)
    const response = await controllerExecutor.workOn(new MockControllerRequestAsPayload(200))
    expect(response.status).toBe(200)
    expect(response.body.headers).toEqual({ authenticationToken: "TOKEN" })
  })

  test("Execute with invalid request params returns 400 and message", async () => {
    request.params = 123
    const controllerExecutor = new ControllerExecutorImplementation(request)
    const response = await controllerExecutor.workOn(CreateTaskControllerImplementation)
    expect(response.status).toBe(400)
    expect(response.body).toBeTruthy()
    expect(typeof response.body === "string").toBeTrue()
  })

  test("Execute with null request params returns 200 and { params: null }", async () => {
    request.params = null
    const controllerExecutor = new ControllerExecutorImplementation(request)
    const response = await controllerExecutor.workOn(new MockControllerRequestAsPayload(200))
    expect(response.status).toBe(200)
    expect(response.body.params).toBeNull()
  })

  test("Execute with valid request params to returns 200 and valid params", async () => {
    request.params = { foo: "bar" }
    const controllerExecutor = new ControllerExecutorImplementation(request)
    const response = await controllerExecutor.workOn(new MockControllerRequestAsPayload(200))
    expect(response.status).toBe(200)
    expect(response.body.params).toEqual({ foo: "bar" })
  })
})

describe("ControllerExecutor | Contructor", () => {
  test("Created with null request throws error", async () => {
    expect(() => {
      new ControllerExecutorImplementation(null)
    }).toThrowError()
  })

  test("Created with undefined request throws error", async () => {
    expect(() => {
      new ControllerExecutorImplementation(undefined)
    }).toThrowError()
  })
})

describe("ControllerExecutor | Execute Arguments", () => {
  test("Executed with null controller returns 500 and message", async () => {
    const controllerExecutor = new ControllerExecutorImplementation(request)
    const response = await controllerExecutor.workOn(null)
    expect(response.status).toBe(500)
    expect(response.body).toBeTruthy()
    expect(typeof response.body === "string").toBeTrue()
  })

  test("Executed with undefined controller return 500 and message", async () => {
    const controllerExecutor = new ControllerExecutorImplementation(request)
    const response = await controllerExecutor.workOn(undefined)
    expect(response.status).toBe(500)
    expect(response.body).toBeTruthy()
    expect(typeof response.body === "string").toBeTrue()
  })

  test("Execute with a controller that does not exists returns 500 and message", async () => {
    const controllerClass = class NonExistentControllerImplementation {}
    const controllerExecutor = new ControllerExecutorImplementation(request)
    const response = await controllerExecutor.workOn(controllerClass)
    expect(response.status).toBe(500)
    expect(response.body).toBeTruthy()
    expect(typeof response.body === "string").toBeTrue()
  })
})

describe("ControllerExecutor | ValidateControllerResponse", () => {
  test("ControllerResponse null returns 500 and message", async () => {
    const controllerExecutor = new ControllerExecutorImplementation(request)
    const response = await controllerExecutor.workOn(new MockControllerArgsAsResponse(null))
    expect(response.status).toBe(500)
    expect(response.body).toBeTruthy()
    expect(typeof response.body === "string").toBeTrue()
  })

  test("ControllerResponse undefined returns 500 and message", async () => {
    const controllerExecutor = new ControllerExecutorImplementation(request)
    const response = await controllerExecutor.workOn(new MockControllerArgsAsResponse(undefined))
    expect(response.status).toBe(500)
    expect(response.body).toBeTruthy()
    expect(typeof response.body === "string").toBeTrue()
  })

  test("ControllerResponse without status returns 500 and message", async () => {
    const controllerExecutor = new ControllerExecutorImplementation(request)
    const response = await controllerExecutor.workOn(new MockControllerStatusPayload(null, "body"))
    expect(response.status).toBe(500)
    expect(response.body).toBeTruthy()
    expect(typeof response.body === "string").toBeTrue()
  })

  test("ControllerResponse with status 201 and has body returns 500 and message", async () => {
    const controllerExecutor = new ControllerExecutorImplementation(request)
    const response = await controllerExecutor.workOn(new MockControllerStatusPayload(201, { foo: "bar" }))
    expect(response.status).toBe(500)
    expect(response.body).toBeTruthy()
    expect(typeof response.body === "string").toBeTrue()
  })

  test("ControllerResponse with status 204 and has body returns 500 and message", async () => {
    const controllerExecutor = new ControllerExecutorImplementation(request)
    const response = await controllerExecutor.workOn(new MockControllerStatusPayload(204, { foo: "bar" }))
    expect(response.status).toBe(500)
    expect(response.body).toBeTruthy()
    expect(typeof response.body === "string").toBeTrue()
  })
})

describe("ControllerExecutor | Success", () => {
  test("Returns the right status and body with mockController", async () => {
    const controllerExecutor = new ControllerExecutorImplementation(request)
    const response = await controllerExecutor.workOn(
      new MockControllerStatusPayload(200, { foo: "bar" })
    )
    expect(response.status).toBe(200)
    expect(response.body).toEqual({ foo: "bar" })
  })

  test("Returns 204 and no body", async () => {
    const controllerExecutor = new ControllerExecutorImplementation(request)
    const response = await controllerExecutor.workOn(new MockControllerStatusPayload(204))
    expect(response.status).toBe(204)
    expect(response.body).not.toBeDefined()
  })

  test("Returns 201 and no body", async () => {
    const controllerExecutor = new ControllerExecutorImplementation(request)
    const response = await controllerExecutor.workOn(new MockControllerStatusPayload(201))
    expect(response.status).toBe(201)
    expect(response.body).not.toBeDefined()
  })
})
