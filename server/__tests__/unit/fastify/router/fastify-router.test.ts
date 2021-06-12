import "jest-extended"

import FastifyRouter from "../../../../src/fastify/router"

import Router from "../../../../src/fastify/router"
import {
  MockControllerArgsAsResponse,
  MockControllerExecuteThrowError,
  MockControllerNoExecute,
  MockControllerNotListed,
  MockControllerPlaceholder,
  MockControllerStatusPayload
} from "../../../utils/mocks/controller.mock"

import MockRequest from "../../../utils/mocks/fastify-request.mock"
import MockResponse from "../../../utils/mocks/fastify-response.mock"

let request: MockRequest
let response: MockResponse
let router: Router = undefined

beforeEach(() => {
  request = new MockRequest()
  request.body = {}
  response = new MockResponse()
  router = new Router(request, response)
})

const getConstructorErr = (request?: any, response?: any): Error | undefined => {
  try {
    new Router(request, response)
    return undefined
  } catch (err) {
    return err
  }
}

const expectsControllerResponseStatusBody = (response: any, status: any, body: any): void => {
  expect(response.status).toBeDefined()
  expect(response.status).toBe(status)
  expect(response.body).toBeDefined()
  expect(response.body).toEqual(body)
}

const expectsDefinedAndNotObject = (val?: any) => {
  expect(val).toBeDefined()
  expect(val).not.toBeNull()
  expect(val).not.toBeObject()
}

const expectsToHaveError = (err: Error | undefined): void => {
  expect(err).toBeDefined()
  expect(err).not.toBeNull()
  expect(err.message).toBeTruthy()
  expect(err.message).toBeString()
}

const expectsValidRouter = (router?: any): void => {
  expect(router).toBeDefined()
  expect(router).toBeObject()
  expect(router).toBeInstanceOf(FastifyRouter)
  expect(router.routeController).toBeDefined()
}

const expectsResponse500AndMessage = (response: MockResponse): void => {
  expect(response.statusCode).toBe(500)
  expect(response.payload).toBeTruthy()
  expect(response.payload).toBeString()
}

const expectsResponse400AndMessage = (response: MockResponse): void => {
  expect(response.statusCode).toBe(400)
  expect(response.payload).toBeTruthy()
  expect(response.payload).toBeString()
}

describe("Router | Constructor | Invalid request and/or response", () => {
  test("Constructed with null request throws error", () => {
    const request = null
    // Given
    expect(request).toBeNull()
    // When
    const constructorErr = getConstructorErr(request, response)
    // Then
    expectsToHaveError(constructorErr)
  })

  test("Constructed with undefined request throws error", () => {
    const request = undefined
    // Given
    expect(request).toBeUndefined()
    // When
    const constructorErr = getConstructorErr(request, response)
    // Then
    expectsToHaveError(constructorErr)
  })

  test("Constructed with not object request throws error", () => {
    const request = 123
    // Given
    expect(request).not.toBeObject()
    // When
    const constructorErr = getConstructorErr(request, response)
    // Then
    expectsToHaveError(constructorErr)
  })

  test("Constructed with null response throws error", () => {
    const response = null
    // Given
    expect(response).toBeNull()
    // When
    const constructorErr = getConstructorErr(request, response)
    // Then
    expectsToHaveError(constructorErr)
  })

  test("Constructed with undefined response throws error", () => {
    const response = undefined
    // Given
    expect(response).toBeUndefined()
    // When
    const constructorErr = getConstructorErr(request, response)
    // Then
    expectsToHaveError(constructorErr)
  })

  test("Constructed with not object response throws error", () => {
    const response = 123
    // Given
    expect(response).not.toBeObject()
    // When
    const constructorErr = getConstructorErr(request, response)
    // Then
    expectsToHaveError(constructorErr)
  })
})

describe("Router | RouteController | Invalid controller as argument", () => {
  test("When null controllerArg. Then response 500/message", async () => {
    const controller = null
    // Given
    expectsValidRouter(router)
    expect(controller).toBeNull()
    // When
    await router.routeController(controller)
    // Then
    expectsResponse500AndMessage(response)
  })

  test("When undefined controllerArg. Then response 500/message", async () => {
    const controller = undefined
    // Given
    expectsValidRouter(router)
    expect(controller).toBeUndefined()
    // When
    await router.routeController(controller)
    // Then
    expectsResponse500AndMessage(response)
  })

  test("When defined but not Function or Object controllerArg. Then response 500/message", async () => {
    const controller = 123
    // Given
    expectsValidRouter(router)
    expect(controller).not.toBeObject()
    expect(controller).not.toBeFunction()
    // When
    // @ts-ignore
    await router.routeController(controller)
    // Then
    expectsResponse500AndMessage(response)
  })

  test("When controllerArg typeof Object and have no execute. Then response 500/message", async () => {
    const controller = new MockControllerNoExecute()
    // Given
    expectsValidRouter(router)
    // @ts-ignore
    expect(controller.execute).toBeUndefined()
    // When
    // @ts-ignore
    await router.routeController(controller)
    // Then
    expectsResponse500AndMessage(response)
  })

  test("When controllerArg typeof Function and not listed. Then response 500/message", async () => {
    const controller = MockControllerNotListed
    // Given
    expectsValidRouter(router)
    expect(controller).toBeFunction()
    // When
    await router.routeController(controller)
    // Then
    expectsResponse500AndMessage(response)
  })
})

describe("Router | RouteController | Invalid request body/headers/params", () => {
  test("When Request body not a object. Then response 400/message", async () => {
    request.body = 123
    // Given
    expectsValidRouter(router)
    expectsDefinedAndNotObject(request.body)
    // Then
    await router.routeController(new MockControllerPlaceholder())
    // When
    expectsResponse400AndMessage(response)
  })

  test("When Request headers not object. Then response 400/message", async () => {
    // @ts-ignore
    request.headers = 123
    // Given
    expectsDefinedAndNotObject(request.headers)
    // When
    await router.routeController(new MockControllerPlaceholder())
    // Then
    expectsResponse400AndMessage(response)
  })

  test("When Request headers authentication_token not string. Then response 400/message", async () => {
    // @ts-ignore
    request.headers.authentication_token = 123
    // Given
    expectsValidRouter(router)
    expectsDefinedAndNotObject(request.headers.authentication_token)
    // When
    await router.routeController(new MockControllerPlaceholder())
    // Then
    expectsResponse400AndMessage(response)
  })

  test("When Request params not object. Then response 400/message", async () => {
    request.params = 123
    // Given
    expectsValidRouter(router)
    expectsDefinedAndNotObject(request.params)
    // When
    await router.routeController(new MockControllerPlaceholder())
    // Then
    expectsResponse400AndMessage(response)
  })
})

describe("Router | RouteController | Controller throws error", () => {
  const getControllerError = async (controller?: any): Promise<Error> => {
    try {
      await controller.execute(undefined)
      return null
    } catch (err) {
      return err
    }
  }

  test("When Controller.Execute throws error. Then response 500/message", async () => {
    const controller = new MockControllerExecuteThrowError()
    const controllerErr = await getControllerError(controller)
    // Given
    expectsToHaveError(controllerErr)
    expectsValidRouter(router)
    // When
    await router.routeController(controller)
    // Then
    expectsResponse500AndMessage(response)
  })
})

describe("Router | RouteController | Invalid controller response", () => {
  test("When Null controllerResponse. Then response 500/message", async () => {
    const controller = new MockControllerArgsAsResponse(null)
    const controllerResponse = await controller.execute()
    // Given
    expectsValidRouter(router)
    expect(controllerResponse).toBeNull()
    // When
    await router.routeController(controller)
    // Then
    expectsResponse500AndMessage(response)
  })

  test("When Undefined controllerResponse. Then response 500/message", async () => {
    const controller = new MockControllerArgsAsResponse(undefined)
    const controllerResponse = await controller.execute()
    // Given
    expectsValidRouter(router)
    expect(controllerResponse).toBeUndefined()
    // When
    await router.routeController(controller)
    // Then
    expectsResponse500AndMessage(response)
  })

  test("When Undefined status. Then response 500/message", async () => {
    const controller = new MockControllerStatusPayload(undefined, { foo: "bar" })
    const controllerResponse = await controller.execute()
    // Given
    expectsValidRouter(router)
    expect(controllerResponse.status).toBeUndefined()
    // When
    await router.routeController(controller)
    // Then
    expectsResponse500AndMessage(response)
  })

  test("When IsNaN status. Then response 500/message", async () => {
    const controller = new MockControllerStatusPayload("foo", "bar")
    const controllerResponse = await controller.execute()
    // Given
    expectsValidRouter(router)
    expect(controllerResponse.status).toBeDefined()
    expect(controllerResponse.status).not.toBeNull()
    expect(controllerResponse.status).not.toBeNumber()
    // When
    await router.routeController(controller)
    // Then
    expectsResponse500AndMessage(response)
  })

  test("When Status 201 with body. Then response 500/message", async () => {
    const controller = new MockControllerStatusPayload(201, { foo: "bar" })
    const controllerResponse = await controller.execute()
    // Given
    expectsValidRouter(router)
    expectsControllerResponseStatusBody(controllerResponse, 201, { foo: "bar" })
    // expect(controllerResponse.status).toBeDefined()
    // expect(controllerResponse.status).toBe(201)
    // expect(controllerResponse.body).toBeDefined()
    // expect(controllerResponse.body).toEqual({ foo: "bar" })
    // When
    await router.routeController(controller)
    // Then
    expectsResponse500AndMessage(response)
  })

  test("When Status 204 with body. Then response 500/message", async () => {
    const controller = new MockControllerStatusPayload(204, { foo: "bar" })
    const controllerResponse = await controller.execute()
    // Given
    expectsValidRouter(router)
    expectsControllerResponseStatusBody(controllerResponse, 204, { foo: "bar" })
    // expect(controllerResponse.status).toBeDefined()
    // expect(controllerResponse.status).toBe(204)
    // expect(controllerResponse.body).toBeDefined()
    // expect(controllerResponse.body).toEqual({ foo: "bar" })
    // When
    await router.routeController(controller)
    // Then
    expectsResponse500AndMessage(response)
  })
})

describe("Router | RouteController | Valid controller responses", () => {
  test("When Controller => 200/body. Then response 200/body", async () => {
    const controller = new MockControllerStatusPayload(200, { foo: "bar" })
    const controllerResponse = await controller.execute()
    // Given
    expectsValidRouter(router)
    expectsControllerResponseStatusBody(controllerResponse, 200, { foo: "bar" })
    // When
    await router.routeController(controller)
    // Then
    expect(response.statusCode).toBe(200)
    expect(response.payload).toEqual({ foo: "bar" })
  })

  test("When Controller => 201. Then response 201", async () => {
    const controller = new MockControllerStatusPayload(201, undefined)
    const controllerResponse = await controller.execute()
    // Given
    expectsValidRouter(router)
    expect(controllerResponse.status).toBe(201)
    expect(controllerResponse.body).toBeUndefined()
    // When
    await router.routeController(controller)
    // Then
    expect(response.statusCode).toBe(201)
    expect(response.payload).toBeUndefined()
  })

  test("When Controller => 204. Then response 204", async () => {
    const controller = new MockControllerStatusPayload(204, undefined)
    const controllerResponse = await controller.execute()
    // Given
    expectsValidRouter(router)
    expect(controllerResponse.status).toBe(204)
    expect(controllerResponse.body).toBeUndefined()
    // When
    await router.routeController(controller)
    // Then
    expect(response.statusCode).toBe(204)
    expect(response.payload).toBeUndefined()
  })

  test("When Controller => 400/message. Then response 400/message", async () => {
    const controller = new MockControllerStatusPayload(400, "Bad Request")
    const controllerResponse = await controller.execute()
    // Given
    expectsValidRouter(router)
    expectsControllerResponseStatusBody(controllerResponse, 400, "Bad Request")
    // When
    await router.routeController(controller)
    // Then
    expect(response.statusCode).toBe(400)
    expect(response.payload).toBeTruthy()
    expect(response.payload).toBeString()
  })

  test("When Controller => 401/message. Then response 401/message", async () => {
    const controller = new MockControllerStatusPayload(401, "Unauthorized")
    const controllerResponse = await controller.execute()
    // Given
    expectsValidRouter(router)
    expectsControllerResponseStatusBody(controllerResponse, 401, "Unauthorized")
    // When
    await router.routeController(controller)
    // Then
    expect(response.statusCode).toBe(401)
    expect(response.payload).toBeTruthy()
    expect(response.payload).toBeString()
  })
})
