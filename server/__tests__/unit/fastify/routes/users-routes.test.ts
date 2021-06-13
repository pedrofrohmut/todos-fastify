import "jest-extended"

import { FastifyInstance } from "fastify"

import { buildTestServerWithUsersRoutes } from "../../../utils/server/fastify-test.server"

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

  test("Return is not a 404", async () => {
    // Given
    expect(url).toBe("/api/users")
    expect(method).toBe(POST)
    // When
    const response = await server.inject({ method, url })
    // Then
    expect(response.statusCode).not.toBe(404)
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
})

describe("SignInUserRoute", () => {
  const url = "/api/users/signin"
  const method = POST

  test("Return is not a 404", async () => {
    // Given
    expect(url).toBe("/api/users/signin")
    expect(method).toBe(POST)
    // When
    const response = await server.inject({ method, url })
    expect(response.statusCode).not.toBe(404)
  })
})
