import FastifyControllerAdapter from "../../../../../src/domain/adapters/controller/fastify-controller.adapter"

import {
  MockControllerRequestAsPayload,
  MockControllerStatusPayload
} from "../../../../utils/mocks/controller.mock"
import MockRequest from "../../../../utils/mocks/fastify-request.mock"
import MockResponse from "../../../../utils/mocks/fastify-response.mock"

describe("FastifyControllerAdapter", () => {
  const status = 200
  const nullResponse = { body: null, headers: null, params: null }

  let request: MockRequest
  let response: MockResponse

  beforeEach(() => {
    request = new MockRequest()
    response = new MockResponse()
  })

  test("body null => null", async () => {
    request.body = null
    const controller = new MockControllerRequestAsPayload(status)
    const adapter = new FastifyControllerAdapter(request, response)
    await adapter.executeController(controller)
    expect(response.statusCode).toBe(status)
    expect(response.payload).toEqual(nullResponse)
  })

  test("body empty => null", async () => {
    request.body = {}
    const controller = new MockControllerRequestAsPayload(status)
    const adapter = new FastifyControllerAdapter(request, response)
    await adapter.executeController(controller)
    expect(response.statusCode).toBe(status)
    expect(response.payload).toEqual(nullResponse)
  })

  test("body valid => body", async () => {
    request.body = { foo: "bar" }
    const controller = new MockControllerRequestAsPayload(status)
    const adapter = new FastifyControllerAdapter(request, response)
    await adapter.executeController(controller)
    expect(response.statusCode).toBe(status)
    expect(response.payload).toEqual({ ...nullResponse, body: request.body })
  })

  test("without headers => null", async () => {
    request.headers = undefined
    const controller = new MockControllerRequestAsPayload(status)
    const adapter = new FastifyControllerAdapter(request, response)
    await adapter.executeController(controller)
    expect(response.statusCode).toBe(status)
    expect(response.payload).toEqual(nullResponse)
  })

  test("'authentication_token' headers  without token => null", async () => {
    request.headers = { authentication_token: null }
    const controller = new MockControllerRequestAsPayload(status)
    const adapter = new FastifyControllerAdapter(request, response)
    await adapter.executeController(controller)
    expect(response.statusCode).toBe(status)
    expect(response.payload).toEqual(nullResponse)
  })

  test("headers with token not string to throw error", async () => {
    // @ts-ignore
    request.headers = { authentication_token: 123 }
    const controller = new MockControllerRequestAsPayload(status)
    const adapter = new FastifyControllerAdapter(request, response)
    await expect(adapter.executeController(controller)).rejects.toThrowError()
  })

  test("'authentication_token' headers with token => { authenticationToken: '...' }", async () => {
    const token = "token"
    request.headers = { authentication_token: token }
    const controller = new MockControllerRequestAsPayload(status)
    const adapter = new FastifyControllerAdapter(request, response)
    await adapter.executeController(controller)
    expect(response.statusCode).toBe(status)
    expect(response.payload).toEqual({ ...nullResponse, headers: { authenticationToken: token } })
  })

  test("no params => null", async () => {
    request.params = null
    const controller = new MockControllerRequestAsPayload(status)
    const adapter = new FastifyControllerAdapter(request, response)
    await adapter.executeController(controller)
    expect(response.statusCode).toBe(status)
    expect(response.payload).toEqual(nullResponse)
  })

  test("empty params => null", async () => {
    request.params = {}
    const controller = new MockControllerRequestAsPayload(status)
    const adapter = new FastifyControllerAdapter(request, response)
    await adapter.executeController(controller)
    expect(response.statusCode).toBe(status)
    expect(response.payload).toEqual(nullResponse)
  })

  test("valid params => params", async () => {
    request.params = { taskId: "taskId" }
    const controller = new MockControllerRequestAsPayload(status)
    const adapter = new FastifyControllerAdapter(request, response)
    await adapter.executeController(controller)
    expect(response.statusCode).toBe(status)
    expect(response.payload).toEqual({ ...nullResponse, params: request.params })
  })

  test("valid body, headers, params => body, { authenticationToken: '...' }, params", async () => {
    request.body = { foo: "bar" }
    request.headers = { authentication_token: "token" }
    request.params = { taskId: "taskId" }
    const controller = new MockControllerRequestAsPayload(status)
    const adapter = new FastifyControllerAdapter(request, response)
    await adapter.executeController(controller)
    expect(response.statusCode).toBe(status)
    expect(response.payload).toEqual({
      body: request.body,
      headers: { authenticationToken: "token" },
      params: request.params
    })
  })

  test("controller undefined throws error", async () => {
    const adapter = new FastifyControllerAdapter(request, response)
    await expect(adapter.executeController(undefined)).rejects.toThrowError()
  })

  test("controllerResponse with no status throws error", async () => {
    const controller = new MockControllerRequestAsPayload(undefined)
    const adapter = new FastifyControllerAdapter(request, response)
    await expect(adapter.executeController(controller)).rejects.toThrowError()
  })

  test("controllerResponse with status === 201 and no body should work", async () => {
    const controller = new MockControllerStatusPayload(201, undefined)
    const adapter = new FastifyControllerAdapter(request, response)
    await adapter.executeController(controller)
    expect(response.statusCode).toBe(201)
    expect(response.payload).not.toBeDefined()
  })

  test("controlerResponse with status === 204 and no body should work", async () => {
    const controller = new MockControllerStatusPayload(204, undefined)
    const adapter = new FastifyControllerAdapter(request, response)
    await adapter.executeController(controller)
    expect(response.statusCode).toBe(204)
    expect(response.payload).not.toBeDefined()
  })

  test("controller with status that are not 201 or 204 with no body throws error", async () => {
    const controller = new MockControllerStatusPayload(200, undefined)
    const adapter = new FastifyControllerAdapter(request, response)
    await expect(adapter.executeController(controller)).rejects.toThrowError()
  })
})
