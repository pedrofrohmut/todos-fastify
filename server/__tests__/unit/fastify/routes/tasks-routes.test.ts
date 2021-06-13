import "jest-extended"

import { FastifyInstance } from "fastify"

import { buildTestServerWithTasksRoutes } from "../../../utils/server/fastify-test.server"

const POST = "POST"
const GET = "GET"
const PUT = "PUT"
const DELETE = "DELETE"

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
})

describe("DeleteTaskRoute", () => {
  const url = "/api/tasks/1"
  const method = DELETE

  test("Return is not a 404", async () => {
    // Given
    expect(url).toBe("/api/tasks/1")
    expect(method).toBe(DELETE)
    // When
    const response = await server.inject({ method, url })
    // Then
    expect(response.statusCode).not.toBe(404)
  })
})

describe("FindTaskByIdRoute", () => {
  const url = "/api/tasks/1"
  const method = GET

  test("Return is not a 404", async () => {
    // Given
    expect(url).toBe("/api/tasks/1")
    expect(method).toBe(GET)
    // When
    const response = await server.inject({ method, url })
    // Then
    expect(response.statusCode).not.toBe(404)
  })
})

describe("FindTasksByUserIdRoute", () => {
  const url = "/api/tasks/user/1"
  const method = GET

  test("Return is not a 404", async () => {
    // Given
    expect(url).toBe("/api/tasks/user/1")
    expect(method).toBe(GET)
    // When
    const response = await server.inject({ method, url })
    // Then
    expect(response.statusCode).not.toBe(404)
  })
})

describe("UpdateTaskRoute", () => {
  const url = "/api/tasks/1"
  const method = PUT

  test("Return in not a 404", async () => {
    // Given
    expect(url).toBe("/api/tasks/1")
    expect(method).toBe(PUT)
    // When
    const response = await server.inject({ method, url })
    // Then
    expect(response.statusCode).not.toBe(404)
  })
})
