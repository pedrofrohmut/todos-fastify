import { FastifyInstance } from "fastify"
import "jest-extended"

import { buildTestServerWithUsersRoutes } from "../../../utils/server/fastify-test.server"

import { CreateUserBody, SignInUserBody } from "../../../../src/domain/types/controller/body.types"

const headers = { authentication_token: "TOKEN" }
const POST = "POST"
const GET = "GET"

let server: FastifyInstance

beforeAll(() => {
  server = buildTestServerWithUsersRoutes()
})

afterAll(() => {
  server.close()
})

describe("CreateUserRoute", () => {
  const url = "/api/users"
  const method = POST
  const body: CreateUserBody = { name: "UserName", email: "user@email.com", password: "UserPassword" }

  test("Return is not a 404", async () => {
    // Given
    expect(url).toBe("/api/users")
    expect(method).toBe(POST)
    // When
    const response = await server.inject({ method, url })
    // Then
    expect(response.statusCode).not.toBe(404)
  })

  test("Without body to return 400 and message", async () => {
    // Given
    expect(url).toBe("/api/users")
    expect(method).toBe(POST)
    // When
    const response = await server.inject({ method, url })
    // Then
    expect(response.statusCode).toBe(400)
    expect(response.payload).toBeTruthy()
    expect(typeof response.payload === "string").toBeTrue()
  })

  test("With body return 201 or 500", async () => {
    // Given
    expect(url).toBe("/api/users")
    expect(method).toBe(POST)
    expect(body).toEqual({ name: "UserName", email: "user@email.com", password: "UserPassword" })
    // When
    const response = await server.inject({ method, url, payload: body })
    // Then
    expect(response.statusCode).toBeOneOf([201, 500])
    if (response.statusCode === 201) {
      expect(response.payload).toBeFalsy()
    }
    if (response.statusCode === 500) {
      expect(response.payload).toBeTruthy()
      expect(typeof response.payload === "string").toBeTrue()
    }
  })
})

describe("GetSignedUserRoute", () => {
  const url = "/api/users/signed"
  const method = GET

  test("Return is not a 404", async () => {
    // GIVEN
    expect(url).toBe("/api/users/signed")
    expect(method).toBe(GET)
    // When
    const response = await server.inject({ method, url })
    // Then
    expect(response.statusCode).not.toBe(404)
  })

  test("Without authentication headers to return 401", async () => {
    // GIVEN
    expect(url).toBe("/api/users/signed")
    expect(method).toBe(GET)
    // When
    const response = await server.inject({ method, url })
    // Then
    expect(response.statusCode).toBe(401)
    expect(response.payload).toBeTruthy()
    expect(typeof response.payload === "string").toBeTrue()
  })

  test("With authentication headers return 200 or 500", async () => {
    // GIVEN
    expect(url).toBe("/api/users/signed")
    expect(method).toBe(GET)
    // When
    const response = await server.inject({ method, url, headers })
    // Then
    expect(response.statusCode).toBeOneOf([200, 500])
    expect(response.payload).toBeTruthy()
    if (response.statusCode === 200) {
      expect(typeof JSON.parse(response.payload) === "object").toBeTrue()
    }
    if (response.statusCode === 500) {
      expect(typeof response.payload === "string").toBeTrue()
    }
  })
})

describe("SignInUserRoute", () => {
  const url = "/api/users/signin"
  const method = POST
  const body: SignInUserBody = { email: "user@email.com", password: "UserPassword" }

  test("Return is not a 404", async () => {
    // Given
    expect(url).toBe("/api/users/signin")
    expect(method).toBe(POST)
    // When
    const response = await server.inject({ method, url })
    expect(response.statusCode).not.toBe(404)
  })

  test("Without body to return 400 and message", async () => {
    // Given
    expect(url).toBe("/api/users/signin")
    expect(method).toBe(POST)
    // When
    const response = await server.inject({ method, url })
    // Then
    expect(response.statusCode).toBe(400)
    expect(response.payload).toBeTruthy()
    expect(typeof response.payload === "string").toBeTrue()
  })

  test("With body return 200 or 500", async () => {
    // Given
    expect(url).toBe("/api/users/signin")
    expect(method).toBe(POST)
    expect(body).toEqual({ email: "user@email.com", password: "UserPassword" })
    // When
    const response = await server.inject({ method, url, payload: body })
    // Then
    expect(response.statusCode).toBeOneOf([200, 500])
    expect(response.payload).toBeTruthy()
    if (response.statusCode === 200) {
      expect(typeof JSON.parse(response.payload) === "object").toBeTrue()
    }
    if (response.statusCode === 500) {
      expect(typeof response.payload === "string").toBeTrue()
    }
  })
})
