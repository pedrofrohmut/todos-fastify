import ControllerExecutorImplementation from "../../../../src/domain/controllers/controller-executor.util"

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

describe("ControllerExecutor", () => {
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

  test("Executed with null controller throws error", async () => {
    const controllerExecutor = new ControllerExecutorImplementation(request)
    await expect(controllerExecutor.execute(null)).rejects.toThrowError()
  })

  test("Executed with undefined controller throw error", async () => {
    const controllerExecutor = new ControllerExecutorImplementation(request)
    await expect(controllerExecutor.execute(undefined)).rejects.toThrowError()
  })

  test("Execute with a controller that does not exists throws error", async () => {
    const controllerClass = class NonExistentControllerImplementation {}
    const controllerExecutor = new ControllerExecutorImplementation(request)
    await expect(controllerExecutor.execute(controllerClass)).rejects.toThrowError()
  })

  test("Execute with invalid request body throws error", async () => {
    request.body = 123
    const controllerExecutor = new ControllerExecutorImplementation(request)
    await expect(
      controllerExecutor.execute(CreateTaskControllerImplementation)
    ).rejects.toThrowError()
  })

  test("Execute with null request body return { body: null }", async () => {
    request.body = null
    const controllerExecutor = new ControllerExecutorImplementation(request)
    const response = await controllerExecutor.execute(new MockControllerRequestAsPayload(200))
    expect(response.body.body).toBeNull()
  })

  test("Execute with valid body return valid body", async () => {
    request.body = { foo: "bar" }
    const controllerExecutor = new ControllerExecutorImplementation(request)
    const response = await controllerExecutor.execute(new MockControllerRequestAsPayload(200))
    expect(response.body.body).toEqual({ foo: "bar" })
  })

  test("Execute with invalid request headers throws error", async () => {
    request.headers.authentication_token = ["foo", "bar", "baz"]
    const controllerExecutor = new ControllerExecutorImplementation(request)
    await expect(
      controllerExecutor.execute(CreateTaskControllerImplementation)
    ).rejects.toThrowError()
  })

  test("Execute with null request headers throws error", async () => {
    request.headers.authentication_token = null
    const controllerExecutor = new ControllerExecutorImplementation(request)
    const response = await controllerExecutor.execute(new MockControllerRequestAsPayload(200))
    expect(response.body.headers).toBeNull()
  })

  test("Execute with valid request headers return { authenticationToken: '...' }", async () => {
    request.headers.authentication_token = "TOKEN"
    const controllerExecutor = new ControllerExecutorImplementation(request)
    const response = await controllerExecutor.execute(new MockControllerRequestAsPayload(200))
    expect(response.body.headers).toEqual({ authenticationToken: "TOKEN" })
  })

  test("Execute with invalid request params throws error", async () => {
    request.params = 123
    const controllerExecutor = new ControllerExecutorImplementation(request)
    await expect(
      controllerExecutor.execute(CreateTaskControllerImplementation)
    ).rejects.toThrowError()
  })

  test("Execute with null request params throws error", async () => {
    request.params = null
    const controllerExecutor = new ControllerExecutorImplementation(request)
    const response = await controllerExecutor.execute(new MockControllerRequestAsPayload(200))
    expect(response.body.params).toBeNull()
  })

  test("Execute with valid request params to return valid params", async () => {
    request.params = { foo: "bar" }
    const controllerExecutor = new ControllerExecutorImplementation(request)
    const response = await controllerExecutor.execute(new MockControllerRequestAsPayload(200))
    expect(response.body.params).toEqual({ foo: "bar" })
  })

  test("ControllerResponse null throws error", async () => {
    const controllerExecutor = new ControllerExecutorImplementation(request)
    await expect(
      controllerExecutor.execute(new MockControllerArgsAsResponse(null))
    ).rejects.toThrowError()
  })

  test("ControllerResponse undefined throws error", async () => {
    const controllerExecutor = new ControllerExecutorImplementation(request)
    await expect(
      controllerExecutor.execute(new MockControllerArgsAsResponse(undefined))
    ).rejects.toThrowError()
  })

  test("ControllerResponse without status throw error", async () => {
    const controllerExecutor = new ControllerExecutorImplementation(request)
    await expect(
      controllerExecutor.execute(new MockControllerStatusPayload(null, "body"))
    ).rejects.toThrowError()
  })

  test("ControllerResponse with status 201 and has body throw error", async () => {
    const controllerExecutor = new ControllerExecutorImplementation(request)
    await expect(
      controllerExecutor.execute(new MockControllerStatusPayload(201, { foo: "bar" }))
    ).rejects.toThrowError()
  })

  test("ControllerResponse with status 204 and has body throw error", async () => {
    const controllerExecutor = new ControllerExecutorImplementation(request)
    await expect(
      controllerExecutor.execute(new MockControllerStatusPayload(204, { foo: "bar" }))
    ).rejects.toThrowError()
  })

  test("Returns the right status and body with mockController", async () => {
    const controllerExecutor = new ControllerExecutorImplementation(request)
    const response = await controllerExecutor.execute(
      new MockControllerStatusPayload(200, { foo: "bar" })
    )
    expect(response.status).toBe(200)
    expect(response.body).toEqual({ foo: "bar" })
  })
})
