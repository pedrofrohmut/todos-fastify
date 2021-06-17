import "jest-extended"

import { FastifyInstance } from "fastify"

import { buildTestServerWithTasksRoutes } from "../../../../utils/server/fastify-test.server"

const POST = "POST"

let server: FastifyInstance

beforeAll(() => {
  server = buildTestServerWithTasksRoutes()
})

afterAll(() => {
  server.close()
})

describe("CreateTaskRoute", () => {
  const url = "/api/tasks"
  const method = POST

  test("Return is not a 404", async () => {
    // Given
    expect(url).toBe("/api/tasks")
    expect(method).toBe(POST)
    // When
    const response = await server.inject({ method, url })
    // Then
    expect(response.statusCode).not.toBe(404)
  })

  test.todo("No payload => 400/message")

  test.todo("Falsy payload.name => 400/message")

  test.todo("No headers => 401/message")

  test.todo("Headers with no authentication_token => 401/message")

  test.todo("Headers with invalid token in the authentication_token => 400/message")

  test.todo("The User from authentication_token doesnt exists => 400/message")

  test.todo("Valid payload and headers => 201")
})
