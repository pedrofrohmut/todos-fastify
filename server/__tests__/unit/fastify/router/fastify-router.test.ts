import "jest-extended"
import ControllerFactory from "../../../../src/domain/factories/controller-factory.interface"
import { Controller } from "../../../../src/domain/types/router.types"
import ControllerResponseValidator from "../../../../src/domain/validators/controller-response-validator.interface"
import FastifyRouter from "../../../../src/fastify/router/implementations/fastify.router"
import RequestAdapter from "../../../../src/fastify/router/request-adapter.interface"
import Router from "../../../../src/fastify/router/router.interface"

import { MockControllerFactoryImplementation } from "../../../utils/mocks/domain/factories/controller-factory-implementation.mock"
import { MockControllerResponseValidatorImplementation } from "../../../utils/mocks/domain/validators/controller-response-validator-implementation.mock"
import {
  MockControllerArgsAsResponse,
  MockControllerNoExecute,
  MockControllerPlaceholder,
  MockControllerStatusPayload
} from "../../../utils/mocks/domain/controllers/controller.mock"
import { MockFastifyRequestAdapter } from "../../../utils/mocks/fastify/router/fastify-request-adapter.mock"
import MockRequest from "../../../utils/mocks/fastify/fastify-request.mock"
import MockResponse from "../../../utils/mocks/fastify/fastify-response.mock"
import { getSyncError } from "../../../utils/functions/error.functions"
import {
  expectsInjectResponse400AndMessage,
  expectsInjectResponse500AndMessage
} from "../../../utils/functions/expects.functions"
import DatabaseConnection from "../../../../src/domain/database/database-connection.interface"

const mockOpenConnection = jest.fn()
const mockCloseConnection = jest.fn()
const MockConnection = jest.fn().mockImplementation(() => ({
  open: mockOpenConnection,
  close: mockCloseConnection
}))

const getControllerFactoryError = (controllerFactory: any, controller: any): null | Error => {
  const possibleErr = getSyncError(() => {
    controllerFactory.getController(controller)
  })
  return possibleErr
}

const getRequestAdapterError = (requestAdapter: any, request: any): null | Error => {
  const possibleErr = getSyncError(() => {
    requestAdapter.adapt(request)
  })
  return possibleErr
}

const getControllerResponseValidationError = (
  validator: ControllerResponseValidator,
  controllerResponse: any
): null | Error => {
  const possibleErr = getSyncError(() => {
    validator.validate(controllerResponse)
  })
  return possibleErr
}

const expectsValidRouter = (router: any): void => {
  expect(router).toBeTruthy()
  expect(router).toBeInstanceOf(FastifyRouter)
}

const expectsValidController = (controller: any): void => {
  expect(controller).toBeTruthy()
  expect(controller.execute).toBeDefined()
}

let request: MockRequest
let response: MockResponse
let requestAdapter: RequestAdapter
let controllerFactory: ControllerFactory
let controllerResponseValidator: ControllerResponseValidator
let connection: DatabaseConnection

beforeEach(() => {
  request = new MockRequest()
  response = new MockResponse()
  requestAdapter = new MockFastifyRequestAdapter()
  controllerFactory = new MockControllerFactoryImplementation()
  controllerResponseValidator = new MockControllerResponseValidatorImplementation()
  connection = MockConnection()
})

describe("FastifyRouter | RouteController | Open and close connection", () => {
  let router: Router
  let controller: jest.Mock

  beforeEach(() => {
    router = new FastifyRouter(
      request,
      response,
      requestAdapter,
      controllerFactory,
      controllerResponseValidator,
      connection
    )
    controller = jest.fn()
  })

  test("The connection is opened", async () => {
    // Given
    expect(router).toBeTruthy()
    expect(controller).toBeTruthy()
    // When
    await router.routeController(controller)
    // Then
    expect(mockOpenConnection).toHaveBeenCalled()
  })

  test("The connection is closed", async () => {
    // Given
    expect(router).toBeTruthy()
    expect(controller).toBeTruthy()
    // When
    await router.routeController(controller)
    // Then
    expect(mockCloseConnection).toHaveBeenCalled()
  })

  test("The connection is opened and closed", async () => {
    // Given
    expect(router).toBeTruthy()
    expect(controller).toBeTruthy()
    // When
    await router.routeController(controller)
    // Then
    expect(mockOpenConnection).toHaveBeenCalled()
    expect(mockCloseConnection).toHaveBeenCalled()
  })
})

describe("FastifyRouter | RouterController | Invalid controller as argument", () => {
  let controllerFactory: ControllerFactory
  let router: Router

  beforeEach(() => {
    controllerFactory = new MockControllerFactoryImplementation()
    router = new FastifyRouter(
      request,
      response,
      requestAdapter,
      controllerFactory,
      controllerResponseValidator,
      connection
    )
  })

  test("Null then response 500/message", async () => {
    const controller = null
    const controllerFactoryErr = getControllerFactoryError(controllerFactory, controller)
    // Given
    expect(controller).toBeNull()
    expect(controllerFactoryErr).toBeTruthy()
    expectsValidRouter(router)
    // When
    await router.routeController(controller)
    // Then
    expectsInjectResponse500AndMessage(response)
  })

  test("Undefined then response 500/message", async () => {
    const controller = undefined
    const controllerFactoryErr = getControllerFactoryError(controllerFactory, controller)
    // Given
    expect(controller).toBeUndefined()
    expect(controllerFactoryErr).toBeTruthy()
    expectsValidRouter(router)
    // When
    await router.routeController(controller)
    // Then
    expectsInjectResponse500AndMessage(response)
  })

  test("Not typeof object or function then response 500/message", async () => {
    const controller = 123
    const controllerFactoryErr = getControllerFactoryError(controllerFactory, controller)
    // Given
    expect(controller).not.toBeObject()
    expect(controller).not.toBeFunction()
    expect(controllerFactoryErr).toBeTruthy()
    expectsValidRouter(router)
    // When
    // @ts-ignore
    await router.routeController(controller)
    // Then
    expectsInjectResponse500AndMessage(response)
  })

  test("Typeof object but no execute then response 500/message", async () => {
    const controller = new MockControllerNoExecute()
    const controllerFactoryErr = getControllerFactoryError(controllerFactory, controller)
    // Given
    expect(controller).toBeObject()
    // @ts-ignore
    expect(controller.execute).toBeUndefined()
    expect(controllerFactoryErr).toBeTruthy()
    expectsValidRouter(router)
    // When
    // @ts-ignore
    await router.routeController(controller)
    // Then
    expectsInjectResponse500AndMessage(response)
  })
})

describe("FastifyRouter | RouteController | Invalid request body/headers/params", () => {
  let requestAdapter: RequestAdapter
  let controller: Controller<any, any>

  beforeEach(() => {
    requestAdapter = new MockFastifyRequestAdapter()
    controller = new MockControllerPlaceholder()
  })

  test("Not typeof object request body then response 400/message", async () => {
    request.body = 123
    const router = new FastifyRouter(
      request,
      response,
      requestAdapter,
      controllerFactory,
      controllerResponseValidator,
      connection
    )
    const requestAdapterErr = getRequestAdapterError(requestAdapter, request)
    // Given
    expect(request.body).not.toBeObject()
    expect(requestAdapterErr).toBeTruthy()
    expectsValidRouter(router)
    expectsValidController(controller)
    // When
    await router.routeController(controller)
    // Then
    expectsInjectResponse400AndMessage(response)
  })

  test("Not typeof object request headers then response 400/message", async () => {
    // @ts-ignore
    request.headers = 123
    const router = new FastifyRouter(
      request,
      response,
      requestAdapter,
      controllerFactory,
      controllerResponseValidator,
      connection
    )
    const requestAdapterErr = getRequestAdapterError(requestAdapter, request)
    // Given
    expect(request.headers).not.toBeObject()
    expect(requestAdapterErr).toBeTruthy()
    expectsValidRouter(router)
    expectsValidController(controller)
    // When
    await router.routeController(controller)
    // Then
    expectsInjectResponse400AndMessage(response)
  })

  test("Not typeof string request headers authentication_token then response 400/message", async () => {
    // @ts-ignore
    request.headers.authentication_token = 123
    const router = new FastifyRouter(
      request,
      response,
      requestAdapter,
      controllerFactory,
      controllerResponseValidator,
      connection
    )
    const requestAdapterErr = getRequestAdapterError(requestAdapter, request)
    // Given
    expect(request.headers).toBeObject()
    expect(request.headers.authentication_token).not.toBeObject()
    expect(requestAdapterErr).toBeTruthy()
    expectsValidRouter(router)
    expectsValidController(controller)
    // When
    await router.routeController(controller)
    // Then
    expectsInjectResponse400AndMessage(response)
  })

  test("Not typeof object request params then response 400/message", async () => {
    // @ts-ignore
    request.params = 123
    const router = new FastifyRouter(
      request,
      response,
      requestAdapter,
      controllerFactory,
      controllerResponseValidator,
      connection
    )
    const requestAdapterErr = getRequestAdapterError(requestAdapter, request)
    // Given
    expect(request.params).not.toBeObject()
    expect(requestAdapterErr).toBeTruthy()
    expectsValidRouter(router)
    expectsValidController(controller)
    // When
    await router.routeController(controller)
    // Then
    expectsInjectResponse400AndMessage(response)
  })
})

describe("FastifyRouter | RouteController | Invalid controller response", () => {
  let router: Router

  beforeEach(() => {
    router = new FastifyRouter(
      request,
      response,
      requestAdapter,
      controllerFactory,
      controllerResponseValidator,
      connection
    )
  })

  test("Null then response 500/message", async () => {
    const controller = new MockControllerArgsAsResponse(null)
    const controllerResponse = await controller.execute()
    const controllerResponseErr = getControllerResponseValidationError(
      controllerResponseValidator,
      controllerResponse
    )
    // Given
    expect(controllerResponse).toBeNull()
    expect(controllerResponseErr).toBeTruthy()
    expectsValidController(controller)
    expectsValidRouter(router)
    // When
    await router.routeController(controller)
    // Then
    expectsInjectResponse500AndMessage(response)
  })

  test("Undefined then response 500/message", async () => {
    const controller = new MockControllerArgsAsResponse(undefined)
    const controllerResponse = await controller.execute()
    const controllerResponseErr = getControllerResponseValidationError(
      controllerResponseValidator,
      controllerResponse
    )
    // Given
    expect(controllerResponse).toBeUndefined()
    expect(controllerResponseErr).toBeTruthy()
    expectsValidController(controller)
    expectsValidRouter(router)
    // When
    await router.routeController(controller)
    // Then
    expectsInjectResponse500AndMessage(response)
  })

  test("Status undefined then response 500/message", async () => {
    const controller = new MockControllerStatusPayload(undefined, "Hello World")
    const controllerResponse = await controller.execute()
    const controllerResponseErr = getControllerResponseValidationError(
      controllerResponseValidator,
      controllerResponse
    )
    // Given
    expect(controllerResponse.status).toBeUndefined()
    expect(controllerResponseErr).toBeTruthy()
    expectsValidController(controller)
    expectsValidRouter(router)
    // When
    await router.routeController(controller)
    // Then
    expectsInjectResponse500AndMessage(response)
  })

  test("Status isNaN then response 500/message", async () => {
    const controller = new MockControllerStatusPayload("foo", "bar")
    const controllerResponse = await controller.execute()
    const controllerResponseErr = getControllerResponseValidationError(
      controllerResponseValidator,
      controllerResponse
    )
    // Given
    expect(controllerResponse.status).not.toBeNumber()
    expect(controllerResponseErr).toBeTruthy()
    expectsValidController(controller)
    expectsValidRouter(router)
    // When
    await router.routeController(controller)
    // Then
    expectsInjectResponse500AndMessage(response)
  })

  test("Status 201 defined body then response 500/message", async () => {
    const controller = new MockControllerStatusPayload(201, "bar")
    const controllerResponse = await controller.execute()
    const controllerResponseErr = getControllerResponseValidationError(
      controllerResponseValidator,
      controllerResponse
    )
    // Given
    expect(controllerResponse.status).toBe(201)
    expect(controllerResponse.body).toBeTruthy()
    expect(controllerResponseErr).toBeTruthy()
    expectsValidController(controller)
    expectsValidRouter(router)
    // When
    await router.routeController(controller)
    // Then
    expectsInjectResponse500AndMessage(response)
  })

  test("Status 204 defined body then response 500/message", async () => {
    const controller = new MockControllerStatusPayload(204, "bar")
    const controllerResponse = await controller.execute()
    const controllerResponseErr = getControllerResponseValidationError(
      controllerResponseValidator,
      controllerResponse
    )
    // Given
    expect(controllerResponse.status).toBe(204)
    expect(controllerResponse.body).toBeTruthy()
    expect(controllerResponseErr).toBeTruthy()
    expectsValidController(controller)
    expectsValidRouter(router)
    // When
    await router.routeController(controller)
    // Then
    expectsInjectResponse500AndMessage(response)
  })
})

describe("FastifyRouter | RouteController | Valid controller response", () => {
  let router: Router

  beforeEach(() => {
    router = new FastifyRouter(
      request,
      response,
      requestAdapter,
      controllerFactory,
      controllerResponseValidator,
      connection
    )
  })

  test("200/body then response 200/body", async () => {
    const status = 200
    const body = { foo: "bar" }
    const controller = new MockControllerStatusPayload(status, body)
    const controllerResponse = await controller.execute()
    const requestAdapterErr = getRequestAdapterError(requestAdapter, request)
    const controllerFactoryErr = getControllerFactoryError(controllerFactory, controller)
    const controllerResponseValidatorErr = getControllerResponseValidationError(
      controllerResponseValidator,
      controllerResponse
    )
    // Given
    expect(controllerResponse.status).toBe(status)
    expect(controllerResponse.body).toEqual(body)
    expect(requestAdapterErr).toBeNull()
    expect(controllerFactoryErr).toBeNull()
    expect(controllerResponseValidatorErr).toBeNull()
    expectsValidController(controller)
    expectsValidRouter(router)
    // When
    await router.routeController(controller)
    // Then
    expect(response.statusCode).toBe(status)
    expect(response.payload).toEqual(body)
  })

  test("201 then response 201", async () => {
    const status = 201
    const controller = new MockControllerStatusPayload(status)
    const controllerResponse = await controller.execute()
    const requestAdapterErr = getRequestAdapterError(requestAdapter, request)
    const controllerFactoryErr = getControllerFactoryError(controllerFactory, controller)
    const controllerResponseValidatorErr = getControllerResponseValidationError(
      controllerResponseValidator,
      controllerResponse
    )
    // Given
    expect(controllerResponse.status).toBe(status)
    expect(requestAdapterErr).toBeNull()
    expect(controllerFactoryErr).toBeNull()
    expect(controllerResponseValidatorErr).toBeNull()
    expectsValidController(controller)
    expectsValidRouter(router)
    // When
    await router.routeController(controller)
    // Then
    expect(response.statusCode).toBe(status)
    expect(response.payload).toBeUndefined()
  })

  test("204 then response 204", async () => {
    const status = 204
    const controller = new MockControllerStatusPayload(status)
    const controllerResponse = await controller.execute()
    const requestAdapterErr = getRequestAdapterError(requestAdapter, request)
    const controllerFactoryErr = getControllerFactoryError(controllerFactory, controller)
    const controllerResponseValidatorErr = getControllerResponseValidationError(
      controllerResponseValidator,
      controllerResponse
    )
    // Given
    expect(controllerResponse.status).toBe(status)
    expect(requestAdapterErr).toBeNull()
    expect(controllerFactoryErr).toBeNull()
    expect(controllerResponseValidatorErr).toBeNull()
    expectsValidController(controller)
    expectsValidRouter(router)
    // When
    await router.routeController(controller)
    // Then
    expect(response.statusCode).toBe(status)
    expect(response.payload).toBeUndefined()
  })

  test("400/message then response 400/message", async () => {
    const status = 400
    const body = "Bad Request"
    const controller = new MockControllerStatusPayload(status, body)
    const controllerResponse = await controller.execute()
    const requestAdapterErr = getRequestAdapterError(requestAdapter, request)
    const controllerFactoryErr = getControllerFactoryError(controllerFactory, controller)
    const controllerResponseValidatorErr = getControllerResponseValidationError(
      controllerResponseValidator,
      controllerResponse
    )
    // Given
    expect(controllerResponse.status).toBe(status)
    expect(controllerResponse.body).toEqual(body)
    expect(requestAdapterErr).toBeNull()
    expect(controllerFactoryErr).toBeNull()
    expect(controllerResponseValidatorErr).toBeNull()
    expectsValidController(controller)
    expectsValidRouter(router)
    // When
    await router.routeController(controller)
    // Then
    expect(response.statusCode).toBe(status)
    expect(response.payload).toEqual(body)
  })

  test("401/message then response 401/message", async () => {
    const status = 401
    const body = "Unauthorized"
    const controller = new MockControllerStatusPayload(status, body)
    const controllerResponse = await controller.execute()
    const requestAdapterErr = getRequestAdapterError(requestAdapter, request)
    const controllerFactoryErr = getControllerFactoryError(controllerFactory, controller)
    const controllerResponseValidatorErr = getControllerResponseValidationError(
      controllerResponseValidator,
      controllerResponse
    )
    // Given
    expect(controllerResponse.status).toBe(status)
    expect(controllerResponse.body).toEqual(body)
    expect(requestAdapterErr).toBeNull()
    expect(controllerFactoryErr).toBeNull()
    expect(controllerResponseValidatorErr).toBeNull()
    expectsValidController(controller)
    expectsValidRouter(router)
    // When
    await router.routeController(controller)
    // Then
    expect(response.statusCode).toBe(status)
    expect(response.payload).toEqual(body)
  })
})
