import "jest-extended"

import Router from "../../../../src/fastify/router/router.interface"
import ControllerFactory from "../../../../src/domain/factories/controller-factory.interface"

import JwtTokenDecoderService from "../../../../src/domain/services/auth/implementations/jwt-token-decoder.service"
import FastifyRequestAdapter from "../../../../src/fastify/router/implementations/fastify-request.adapter"
import FastifyRouter from "../../../../src/fastify/router/implementations/fastify.router"
import ControllerFactoryImplementation from "../../../../src/domain/factories/implementations/controller.factory"
import ControllerResponseValidatorImplementation from "../../../../src/domain/validators/implementations/controller-response.validator"

import MockConnection from "../../../utils/mocks/domain/database/database-connection.mock"
import MockRequest from "../../../utils/mocks/fastify/fastify-request.mock"
import MockResponse from "../../../utils/mocks/fastify/fastify-response.mock"
import { getSyncError } from "../../../utils/functions/error.functions"
import {
  expectsInjectResponse400AndMessage,
  expectsInjectResponse500AndMessage
} from "../../../utils/functions/expects.functions"
import MockController, {
  MockControllerArgsAsResponse,
  MockControllerNoExecute,
  MockControllerStatusPayload
} from "../../../utils/mocks/domain/controllers/controller.mock"
import { MockControllerFactoryAcceptControllerMock } from "../../../utils/mocks/domain/factories/controller-factory.mock"

let request: MockRequest
let response: MockResponse

beforeEach(() => {
  request = new MockRequest()
  response = new MockResponse()
})

const connection = new MockConnection()
const jwtSecret = process.env.JWT_SECRET
const tokenDecoderService = new JwtTokenDecoderService(jwtSecret)
const requestAdapter = new FastifyRequestAdapter(tokenDecoderService)
const controllerFactory = new ControllerFactoryImplementation()
const controllerResponseValidator = new ControllerResponseValidatorImplementation()

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

  test("The connection is opened and closed", async () => {
    // Given
    expect(connection.open).toHaveBeenCalledTimes(0)
    expect(connection.close).toHaveBeenCalledTimes(0)
    // When
    await router.routeController(controller)
    // Then
    expect(connection.open).toHaveBeenCalledTimes(1)
    expect(connection.close).toHaveBeenCalledTimes(1)
    expect(connection.open).toHaveBeenCalledBefore(connection.close)
  })
})

describe("FastifyRouter | RouterController | Invalid controller as argument", () => {
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
    const controller = null
    const controllerFactoryErr = getSyncError(() =>
      controllerFactory.getController(controller, connection)
    )
    // Given
    expect(controller).toBeNull()
    expect(controllerFactoryErr).toBeTruthy()
    // When
    await router.routeController(controller)
    // Then
    expectsInjectResponse500AndMessage(response)
  })

  test("Undefined then response 500/message", async () => {
    const controller = undefined
    const controllerFactoryErr = getSyncError(() =>
      controllerFactory.getController(controller, connection)
    )
    // Given
    expect(controller).toBeUndefined()
    expect(controllerFactoryErr).toBeTruthy()
    // When
    await router.routeController(controller)
    // Then
    expectsInjectResponse500AndMessage(response)
  })

  test("Not typeof object or function then response 500/message", async () => {
    const controller = 123
    // @ts-ignore
    const controllerFactoryErr = getSyncError(() =>
      controllerFactory.getController(controller, connection)
    )
    // Given
    expect(controller).not.toBeObject()
    expect(controller).not.toBeFunction()
    expect(controllerFactoryErr).toBeTruthy()
    // When
    // @ts-ignore
    await router.routeController(controller)
    // Then
    expectsInjectResponse500AndMessage(response)
  })

  test("Typeof object but no execute then response 500/message", async () => {
    const controller = MockControllerNoExecute()
    const controllerFactoryErr = getSyncError(() =>
      controllerFactory.getController(controller, connection)
    )
    // Given
    expect(controller).toBeTruthy()
    expect(controller).toBeObject()
    // @ts-ignore
    expect(controller.execute).toBeUndefined()
    expect(controllerFactoryErr).toBeTruthy()
    // When
    // @ts-ignore
    await router.routeController(controller)
    // Then
    expectsInjectResponse500AndMessage(response)
  })
})

describe("FastifyRouter | RouteController | Invalid request body/headers/params", () => {
  let controller: jest.Mock

  beforeEach(() => {
    controller = new MockController()
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
    const requestAdapterErr = getSyncError(() => requestAdapter.adapt(request))
    // Given
    expect(request.body).not.toBeObject()
    expect(requestAdapterErr).toBeTruthy()
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
    const requestAdapterErr = getSyncError(() => requestAdapter.adapt(request))
    // Given
    expect(request.headers).not.toBeObject()
    expect(requestAdapterErr).toBeTruthy()
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
    const requestAdapterErr = getSyncError(() => requestAdapter.adapt(request))
    // Given
    expect(request.headers).toBeObject()
    expect(request.headers.authentication_token).not.toBeObject()
    expect(requestAdapterErr).toBeTruthy()
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
    const requestAdapterErr = getSyncError(() => requestAdapter.adapt(request))
    // Given
    expect(request.params).not.toBeObject()
    expect(requestAdapterErr).toBeTruthy()
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
    const controller = MockControllerArgsAsResponse(null)()
    const controllerResponse = await controller.execute()
    const controllerResponseErr = getSyncError(() =>
      controllerResponseValidator.validate(controllerResponse)
    )
    // Given
    expect(controllerResponse).toBeNull()
    expect(controllerResponseErr).toBeTruthy()
    // When
    await router.routeController(controller)
    // Then
    expectsInjectResponse500AndMessage(response)
  })

  test("Undefined then response 500/message", async () => {
    const controller = MockControllerArgsAsResponse(undefined)()
    const controllerResponse = await controller.execute()
    const controllerResponseErr = getSyncError(() =>
      controllerResponseValidator.validate(controllerResponse)
    )
    // Given
    expect(controllerResponse).toBeUndefined()
    expect(controllerResponseErr).toBeTruthy()
    // When
    await router.routeController(controller)
    // Then
    expectsInjectResponse500AndMessage(response)
  })

  test("Status undefined then response 500/message", async () => {
    const controller = MockControllerStatusPayload(undefined, "Hello World")()
    const controllerResponse = await controller.execute()
    const controllerResponseErr = getSyncError(() =>
      controllerResponseValidator.validate(controllerResponse)
    )
    // Given
    expect(controllerResponse.status).toBeUndefined()
    expect(controllerResponseErr).toBeTruthy()
    // When
    await router.routeController(controller)
    // Then
    expectsInjectResponse500AndMessage(response)
  })

  test("Status isNaN then response 500/message", async () => {
    // @ts-ignore
    const controller = MockControllerStatusPayload("foo", "bar")()
    const controllerResponse = await controller.execute()
    const controllerResponseErr = getSyncError(() =>
      controllerResponseValidator.validate(controllerResponse)
    )
    // Given
    expect(controllerResponse.status).not.toBeNumber()
    expect(controllerResponseErr).toBeTruthy()
    // When
    await router.routeController(controller)
    // Then
    expectsInjectResponse500AndMessage(response)
  })

  test("Status 201 defined body then response 500/message", async () => {
    const controller = MockControllerStatusPayload(201, "bar")()
    const controllerResponse = await controller.execute()
    const controllerResponseErr = getSyncError(() =>
      controllerResponseValidator.validate(controllerResponse)
    )
    // Given
    expect(controllerResponse.status).toBe(201)
    expect(controllerResponse.body).toBeTruthy()
    expect(controllerResponseErr).toBeTruthy()
    // When
    await router.routeController(controller)
    // Then
    expectsInjectResponse500AndMessage(response)
  })

  test("Status 204 defined body then response 500/message", async () => {
    const controller = MockControllerStatusPayload(204, "bar")()
    const controllerResponse = await controller.execute()
    const controllerResponseErr = getSyncError(() =>
      controllerResponseValidator.validate(controllerResponse)
    )
    // Given
    expect(controllerResponse.status).toBe(204)
    expect(controllerResponse.body).toBeTruthy()
    expect(controllerResponseErr).toBeTruthy()
    // When
    await router.routeController(controller)
    // Then
    expectsInjectResponse500AndMessage(response)
  })
})

describe("FastifyRouter | RouteController | Valid controllerResponse", () => {
  const getRouterForMockController = (controller: jest.Mock): Router => {
    const controllerFactory = MockControllerFactoryAcceptControllerMock(controller)()
    const router = new FastifyRouter(
      request,
      response,
      requestAdapter,
      controllerFactory,
      controllerResponseValidator,
      connection
    )
    return router
  }

  test("200/body then response 200/body", async () => {
    const status = 200
    const body = { foo: "bar" }
    const controller = MockControllerStatusPayload(status, body)()
    const router = getRouterForMockController(controller)
    const controllerResponse = await controller.execute()
    const controllerResponseErr = getSyncError(() =>
      controllerResponseValidator.validate(controllerResponse)
    )
    // Given
    expect(controllerResponse.status).toBe(status)
    expect(controllerResponse.body).toEqual(body)
    expect(controllerResponseErr).toBeNull()
    // When
    await router.routeController(controller)
    // Then
    expect(response.statusCode).toBe(status)
    expect(response.payload).toEqual(body)
  })

  test("201 then response 201", async () => {
    const status = 201
    const controller = MockControllerStatusPayload(status)()
    const router = getRouterForMockController(controller)
    const controllerResponse = await controller.execute()
    const controllerResponseErr = getSyncError(() =>
      controllerResponseValidator.validate(controllerResponse)
    )
    // Given
    expect(controllerResponse.status).toBe(status)
    expect(controllerResponseErr).toBeNull()
    // When
    await router.routeController(controller)
    // Then
    expect(response.statusCode).toBe(status)
    expect(response.payload).toBeUndefined()
  })

  test("204 then response 204", async () => {
    const status = 204
    const controller = MockControllerStatusPayload(status)()
    const router = getRouterForMockController(controller)
    const controllerResponse = await controller.execute()
    const controllerResponseErr = getSyncError(() =>
      controllerResponseValidator.validate(controllerResponse)
    )
    // Given
    expect(controllerResponse.status).toBe(status)
    expect(controllerResponseErr).toBeNull()
    // When
    await router.routeController(controller)
    // Then
    expect(response.statusCode).toBe(status)
    expect(response.payload).toBeUndefined()
  })

  test("400/message then response 400/message", async () => {
    const status = 400
    const body = "Bad Request"
    const controller = MockControllerStatusPayload(status, body)()
    const router = getRouterForMockController(controller)
    const controllerResponse = await controller.execute()
    const controllerResponseErr = getSyncError(() =>
      controllerResponseValidator.validate(controllerResponse)
    )
    // Given
    expect(controllerResponse.status).toBe(status)
    expect(controllerResponse.body).toEqual(body)
    expect(controllerResponseErr).toBeNull()
    // When
    await router.routeController(controller)
    // Then
    expect(response.statusCode).toBe(status)
    expect(response.payload).toEqual(body)
  })

  test("401/message then response 401/message", async () => {
    const status = 401
    const body = "Unauthorized"
    const controller = MockControllerStatusPayload(status, body)()
    const router = getRouterForMockController(controller)
    const controllerResponse = await controller.execute()
    const controllerResponseErr = getSyncError(() =>
      controllerResponseValidator.validate(controllerResponse)
    )
    // Given
    expect(controllerResponse.status).toBe(status)
    expect(controllerResponse.body).toEqual(body)
    expect(controllerResponseErr).toBeNull()
    // When
    await router.routeController(controller)
    // Then
    expect(response.statusCode).toBe(status)
    expect(response.payload).toEqual(body)
  })
})
