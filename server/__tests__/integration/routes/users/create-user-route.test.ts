import "jest-extended"

import { CreateUserBody } from "../../../../src/domain/types/request/body.types"

import CreateUserControllerImplementation from "../../../../src/domain/controllers/users/implementations/create-user.controller"
import FastifyRouter from "../../../../src/fastify/router/implementations/fastify.router"
import FastifyRequestAdapter from "../../../../src/fastify/router/implementations/fastify-request.adapter"
import JwtDecodeTokenService from "../../../../src/domain/services/auth/implementations/jwt-decode-token.service"
import ControllerFactoryImplementation from "../../../../src/domain/factories/implementations/controller.factory"
import ControllerResponseValidatorImplementation from "../../../../src/domain/validators/implementations/controller-response.validator"

import MockRequest from "../../../utils/mocks/fastify/fastify-request.mock"
import MockResponse from "../../../utils/mocks/fastify/fastify-response.mock"
import {
  expectsInjectResponse201,
  expectsInjectResponse400AndMessage
} from "../../../utils/functions/expects.functions"
import Router from "../../../../src/fastify/router/router.interface"
import MockConnection, {
  MockConnectionAcceptQuery
} from "../../../utils/mocks/domain/database/database-connection.mock"
import UserValidatorImplementation from "../../../../src/domain/validators/implementations/user.validator"

const userValidator = new UserValidatorImplementation()

let request
let response

beforeEach(() => {
  request = new MockRequest()
  request.body = {
    name: "User Name",
    email: "user@mail.com",
    password: "user_password"
  } as CreateUserBody
  request.headers = {}
  request.params = {}
  response = new MockResponse()
})

const buildRouter = (request: any, response: any, connection: any): Router => {
  const jwtSecret = process.env.JWT_SECRET
  const tokenDecoderService = new JwtDecodeTokenService(jwtSecret)
  const requestAdapter = new FastifyRequestAdapter(tokenDecoderService)
  const controllerFactory = new ControllerFactoryImplementation()
  const controllerResponseValidator = new ControllerResponseValidatorImplementation()
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

describe("CreateUserRoute | Request", () => {
  test("Undefined body then response 400/message", async () => {
    request.body = null
    const connection = new MockConnection()
    const router = buildRouter(request, response, connection)
    // Given
    expect(request).toBeTruthy()
    expect(request).toBeObject()
    expect(request.body).toBeFalsy()
    // When
    await router.routeController(CreateUserControllerImplementation)
    // Then
    expectsInjectResponse400AndMessage(response)
  })

  test("Invalid name user name then response 400/message", async () => {
    request.body = {
      name: null,
      email: "user@email.com",
      password: "user_password"
    }
    const connection = new MockConnection()
    const router = buildRouter(request, response, connection)
    const nameValidationMessage = userValidator.getMessageForName(request.body.name)
    const emailValidationMessage = userValidator.getMessageForName(request.body.email)
    const passwordValidationMessage = userValidator.getMessageForName(request.body.password)
    // Given
    expect(request).toBeTruthy()
    expect(request).toBeObject()
    expect(request.body).toBeTruthy()
    expect(request.body).toBeObject()
    expect(nameValidationMessage).toBeTruthy()
    expect(emailValidationMessage).toBeNull()
    expect(passwordValidationMessage).toBeNull()
    // When
    await router.routeController(CreateUserControllerImplementation)
    // Then
    expectsInjectResponse400AndMessage(response)
  })

  test("Invalid user email then response 400/message", async () => {
    request.body = {
      name: "User Name",
      email: null,
      password: "user_password"
    }
    const connection = new MockConnection()
    const router = buildRouter(request, response, connection)
    const nameValidationMessage = userValidator.getMessageForName(request.body.name)
    const emailValidationMessage = userValidator.getMessageForName(request.body.email)
    const passwordValidationMessage = userValidator.getMessageForName(request.body.password)
    // Given
    expect(request).toBeTruthy()
    expect(request).toBeObject()
    expect(request.body).toBeTruthy()
    expect(request.body).toBeObject()
    expect(nameValidationMessage).toBeNull()
    expect(emailValidationMessage).toBeTruthy()
    expect(passwordValidationMessage).toBeNull()
    // When
    await router.routeController(CreateUserControllerImplementation)
    // Then
    expectsInjectResponse400AndMessage(response)
  })

  test("Invalid user password then response 400/message", async () => {
    request.body = {
      name: "User Name",
      email: "user@email.com",
      password: null
    }
    const connection = new MockConnection()
    const router = buildRouter(request, response, connection)
    const nameValidationMessage = userValidator.getMessageForName(request.body.name)
    const emailValidationMessage = userValidator.getMessageForName(request.body.email)
    const passwordValidationMessage = userValidator.getMessageForName(request.body.password)
    // Given
    expect(request).toBeTruthy()
    expect(request).toBeObject()
    expect(request.body).toBeTruthy()
    expect(request.body).toBeObject()
    expect(nameValidationMessage).toBeNull()
    expect(emailValidationMessage).toBeNull()
    expect(passwordValidationMessage).toBeTruthy()
    // When
    await router.routeController(CreateUserControllerImplementation)
    // Then
    expectsInjectResponse400AndMessage(response)
  })

  test("Valid body but email already registered then response 400/message", async () => {
    request.body = {
      name: "User Name",
      email: "user@email.com",
      password: "user_password"
    }
    const mockQuery = jest.fn().mockReturnValue([
      {
        name: "User Name 2",
        email: "user@email.com",
        password: "user_password_2"
      }
    ])
    const connection = MockConnectionAcceptQuery(mockQuery)()
    const router = buildRouter(request, response, connection)
    const nameValidationMessage = userValidator.getMessageForName(request.body.name)
    const emailValidationMessage = userValidator.getMessageForName(request.body.email)
    const passwordValidationMessage = userValidator.getMessageForName(request.body.password)
    // Given
    expect(request).toBeTruthy()
    expect(request).toBeObject()
    expect(request.body).toBeTruthy()
    expect(request.body).toBeObject()
    expect(nameValidationMessage).toBeNull()
    expect(emailValidationMessage).toBeNull()
    expect(passwordValidationMessage).toBeNull()
    // When
    await router.routeController(CreateUserControllerImplementation)
    // Then
    expectsInjectResponse400AndMessage(response)
    expect(connection.query).toHaveBeenCalledTimes(1)
  })

  test("Valid body and email available then response 201", async () => {
    request.body = {
      name: "User Name",
      email: "user@email.com",
      password: "user_password"
    }
    const mockQuery = jest.fn().mockReturnValue([])
    const connection = MockConnectionAcceptQuery(mockQuery)()
    const router = buildRouter(request, response, connection)
    const nameValidationMessage = userValidator.getMessageForName(request.body.name)
    const emailValidationMessage = userValidator.getMessageForName(request.body.email)
    const passwordValidationMessage = userValidator.getMessageForName(request.body.password)
    // Given
    expect(request).toBeTruthy()
    expect(request).toBeObject()
    expect(request.body).toBeTruthy()
    expect(request.body).toBeObject()
    expect(nameValidationMessage).toBeNull()
    expect(emailValidationMessage).toBeNull()
    expect(passwordValidationMessage).toBeNull()
    // When
    await router.routeController(CreateUserControllerImplementation)
    // Then
    expectsInjectResponse201(response)
    expect(connection.query).toHaveBeenCalledTimes(1)
    expect(connection.mutate).toHaveBeenCalledTimes(1)
  })
})
