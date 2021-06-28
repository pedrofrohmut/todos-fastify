import "jest-extended"

import { AdaptedRequest } from "../../../../../src/domain/types/router.types"

import PostgresFindUserByEmailService from "../../../../../src/domain/services/users/implementations/postgres-find-user-by-email.service"
import PostgresCreateUserService from "../../../../../src/domain/services/users/implementations/postgres-create-user.service"
import CreateUserUseCaseImplementation from "../../../../../src/domain/usecases/users/implementations/create-user-implementation.usecase"
import CreateUserControllerImplementation from "../../../../../src/domain/controllers/users/implementations/create-user.controller"
import UserValidatorImplementation from "../../../../../src/domain/validators/implementations/user.validator"

import {
  expectsControllerResponse201,
  expectsControllerResponse400AndMessage,
  expectsValidConnection,
  expectsValidDBService
} from "../../../../utils/functions/expects.functions"
import MockConnection, {
  MockConnectionAcceptQuery
} from "../../../../utils/mocks/domain/database/database-connection.mock"
import { CreateUserBody } from "../../../../../src/domain/types/request/body.types"
import BcryptjsHashPasswordService from "../../../../../src/domain/services/auth/implementations/bcryptjs-hash-password.service"

const expectsValidUserValidator = (userValidator: any): void => {
  expect(userValidator).toBeTruthy()
  expect(userValidator).toBeObject()
  expect(userValidator.getMessageForName).toBeDefined()
  expect(userValidator.getMessageForEmail).toBeDefined()
  expect(userValidator.getMessageForPassword).toBeDefined()
}

const expectsValidCreateUserUseCase = (createUserUseCase: any): void => {
  expect(createUserUseCase).toBeTruthy()
  expect(createUserUseCase).toBeObject()
  // @ts-ignore
  expect(createUserUseCase.findUserByEmailService).toBeTruthy()
  // @ts-ignore
  expect(createUserUseCase.hashPasswordService).toBeTruthy()
  // @ts-ignore
  expect(createUserUseCase.createUserService).toBeTruthy()
}

const expectsValidCreateUserController = (createUserController: any): void => {
  expect(createUserController).toBeTruthy()
  expect(createUserController).toBeObject()
  // @ts-ignore
  expect(createUserController.userValidator).toBeTruthy()
  // @ts-ignore
  expect(createUserController.createUserUseCase).toBeTruthy()
}

const expectsValidDependencies = (
  connection: any,
  findUserByEmailService: any,
  createUserService: any,
  userValidator: any,
  createUserUseCase: any,
  createUserController: any
): void => {
  expectsValidConnection(connection)
  expectsValidDBService(findUserByEmailService)
  expectsValidDBService(createUserService)
  expectsValidUserValidator(userValidator)
  expectsValidCreateUserUseCase(createUserUseCase)
  expectsValidCreateUserController(createUserController)
}

const connection = MockConnection()
const findUserByEmailService = new PostgresFindUserByEmailService(connection)
const hashPasswordService = new BcryptjsHashPasswordService()
const createUserService = new PostgresCreateUserService(connection)
const createUserUseCase = new CreateUserUseCaseImplementation(
  findUserByEmailService,
  hashPasswordService,
  createUserService
)
const userValidator = new UserValidatorImplementation()
const createUserController = new CreateUserControllerImplementation(
  userValidator,
  createUserUseCase
)

describe("CreateUserControllerImplementation", () => {
  test("Null body => 400/message", async () => {
    const request: AdaptedRequest<null> = {
      body: null,
      authToken: null,
      params: null
    }
    // Given
    expectsValidDependencies(
      connection,
      findUserByEmailService,
      createUserService,
      userValidator,
      createUserUseCase,
      createUserController
    )
    expect(request.body).toBeNull()
    expect(request.authToken).toBeNull()
    expect(request.params).toBeNull()
    // When
    const controllerResponse = await createUserController.execute(request)
    // Then
    expectsControllerResponse400AndMessage(controllerResponse)
  })

  test("Invalid body.name => 400/message", async () => {
    const request: AdaptedRequest<CreateUserBody> = {
      body: {
        name: null,
        email: "user@email.com",
        password: "userPassword"
      },
      authToken: null,
      params: null
    }
    const nameValidationMessage = userValidator.getMessageForName(request.body.name)
    const emailValidationMessage = userValidator.getMessageForEmail(request.body.email)
    const passwordValidationMessage = userValidator.getMessageForPassword(request.body.password)
    // Given
    expectsValidDependencies(
      connection,
      findUserByEmailService,
      createUserService,
      userValidator,
      createUserUseCase,
      createUserController
    )
    expect(request.body).toBeTruthy()
    expect(nameValidationMessage).toBeString()
    expect(emailValidationMessage).toBeNull()
    expect(passwordValidationMessage).toBeNull()
    expect(request.authToken).toBeNull()
    expect(request.params).toBeNull()
    // When
    const controllerResponse = await createUserController.execute(request)
    // Then
    expectsControllerResponse400AndMessage(controllerResponse)
  })

  test("Invalid body.email => 400/message", async () => {
    const request: AdaptedRequest<CreateUserBody> = {
      body: {
        name: "user name",
        email: null,
        password: "userPassword"
      },
      authToken: null,
      params: null
    }
    const nameValidationMessage = userValidator.getMessageForName(request.body.name)
    const emailValidationMessage = userValidator.getMessageForEmail(request.body.email)
    const passwordValidationMessage = userValidator.getMessageForPassword(request.body.password)
    // Given
    expectsValidDependencies(
      connection,
      findUserByEmailService,
      createUserService,
      userValidator,
      createUserUseCase,
      createUserController
    )
    expect(request.body).toBeTruthy()
    expect(nameValidationMessage).toBeNull()
    expect(emailValidationMessage).toBeTruthy()
    expect(passwordValidationMessage).toBeNull()
    expect(request.authToken).toBeNull()
    expect(request.params).toBeNull()
    // When
    const controllerResponse = await createUserController.execute(request)
    // Then
    expectsControllerResponse400AndMessage(controllerResponse)
  })

  test("No body.password => 400/message", async () => {
    const request: AdaptedRequest<CreateUserBody> = {
      body: {
        name: "user name",
        email: "user@mail.com",
        password: null
      },
      authToken: null,
      params: null
    }
    const nameValidationMessage = userValidator.getMessageForName(request.body.name)
    const emailValidationMessage = userValidator.getMessageForEmail(request.body.email)
    const passwordValidationMessage = userValidator.getMessageForPassword(request.body.password)
    // Given
    expectsValidDependencies(
      connection,
      findUserByEmailService,
      createUserService,
      userValidator,
      createUserUseCase,
      createUserController
    )
    expect(request.body).toBeTruthy()
    expect(nameValidationMessage).toBeNull()
    expect(emailValidationMessage).toBeNull()
    expect(passwordValidationMessage).toBeTruthy()
    expect(request.authToken).toBeNull()
    expect(request.params).toBeNull()
    // When
    const controllerResponse = await createUserController.execute(request)
    // Then
    expectsControllerResponse400AndMessage(controllerResponse)
  })

  test("Valid body and user email is already registered => 400/message", async () => {
    const request: AdaptedRequest<CreateUserBody> = {
      body: {
        name: "user name",
        email: "user@mail.com",
        password: "userPassword"
      },
      authToken: null,
      params: null
    }
    const nameValidationMessage = userValidator.getMessageForName(request.body.name)
    const emailValidationMessage = userValidator.getMessageForEmail(request.body.email)
    const passwordValidationMessage = userValidator.getMessageForPassword(request.body.password)
    const mockQuery = jest.fn(() => [
      {
        id: "userId",
        name: "user name",
        email: "user@mail.com",
        password_hash: "password_hash"
      }
    ])
    const connection = MockConnectionAcceptQuery(mockQuery)()
    const findUserByEmailService = new PostgresFindUserByEmailService(connection)
    const createUserService = new PostgresCreateUserService(connection)
    const createUserUseCase = new CreateUserUseCaseImplementation(
      findUserByEmailService,
      hashPasswordService,
      createUserService
    )
    const createUserController = new CreateUserControllerImplementation(
      userValidator,
      createUserUseCase
    )
    const userRegistered = await findUserByEmailService.execute(request.body.email)
    // Given
    expectsValidDependencies(
      connection,
      findUserByEmailService,
      createUserService,
      userValidator,
      createUserUseCase,
      createUserController
    )
    expect(request.body).toBeTruthy()
    expect(nameValidationMessage).toBeNull()
    expect(emailValidationMessage).toBeNull()
    expect(passwordValidationMessage).toBeNull()
    expect(request.authToken).toBeNull()
    expect(request.params).toBeNull()
    expect(userRegistered).toBeTruthy()
    // When
    const controllerResponse = await createUserController.execute(request)
    // Then
    expectsControllerResponse400AndMessage(controllerResponse)
    expect(connection.query).toHaveBeenCalledTimes(2)
    expect(connection.mutate).toHaveBeenCalledTimes(0)
  })

  test("Valid body and user email is not registered => 201", async () => {
    const request: AdaptedRequest<CreateUserBody> = {
      body: {
        name: "user name",
        email: "user@mail.com",
        password: "userPassword"
      },
      authToken: null,
      params: null
    }
    const nameValidationMessage = userValidator.getMessageForName(request.body.name)
    const emailValidationMessage = userValidator.getMessageForEmail(request.body.email)
    const passwordValidationMessage = userValidator.getMessageForPassword(request.body.password)
    const mockQuery = jest.fn(() => [])
    const connection = MockConnectionAcceptQuery(mockQuery)()
    const findUserByEmailService = new PostgresFindUserByEmailService(connection)
    const createUserService = new PostgresCreateUserService(connection)
    const createUserUseCase = new CreateUserUseCaseImplementation(
      findUserByEmailService,
      hashPasswordService,
      createUserService
    )
    const createUserController = new CreateUserControllerImplementation(
      userValidator,
      createUserUseCase
    )
    const userRegistered = await findUserByEmailService.execute(request.body.email)
    // Given
    expectsValidDependencies(
      connection,
      findUserByEmailService,
      createUserService,
      userValidator,
      createUserUseCase,
      createUserController
    )
    expect(request.body).toBeTruthy()
    expect(nameValidationMessage).toBeNull()
    expect(emailValidationMessage).toBeNull()
    expect(passwordValidationMessage).toBeNull()
    expect(request.authToken).toBeNull()
    expect(request.params).toBeNull()
    expect(userRegistered).toBeFalsy()
    // When
    const controllerResponse = await createUserController.execute(request)
    // Then
    expectsControllerResponse201(controllerResponse)
    expect(connection.query).toHaveBeenCalledTimes(2)
    expect(connection.mutate).toHaveBeenCalledTimes(1)
  })
})
