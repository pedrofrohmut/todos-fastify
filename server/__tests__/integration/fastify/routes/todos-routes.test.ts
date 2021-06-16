import { FastifyInstance } from "fastify"
import "jest-extended"

import { buildTestServerWithTodosRoutes } from "../../../utils/server/fastify-test.server"

const POST = "POST"
const GET = "GET"
const PUT = "PUT"
const PATCH = "PATCH"
const DELETE = "DELETE"

let server: FastifyInstance

beforeAll(() => {
  server = buildTestServerWithTodosRoutes()
})

afterAll(() => {
  server.close()
})

describe("ClearCompleteTodosByTaskIdRoute", () => {
  const url = "/api/todos/task/1"
  const method = DELETE

  test("Return is not a 404", async () => {
    // Given
    expect(url).toBe("/api/todos/task/1")
    expect(method).toBe(DELETE)
    // When
    const response = await server.inject({ method, url })
    // Then
    expect(response.statusCode).not.toBe(404)
  })
})

describe("CreateTodoRoute", () => {
  const url = "/api/todos"
  const method = POST

  test("Return is not a 404", async () => {
    // Given
    expect(url).toBe("/api/todos")
    expect(method).toBe(POST)
    // When
    const response = await server.inject({ method, url })
    // Then
    expect(response.statusCode).not.toBe(404)
  })
})

describe("DeleteTodoRoute", () => {
  const url = "/api/todos/1"
  const method = DELETE

  test("Return is not a 404", async () => {
    // Given
    expect(url).toBe("/api/todos/1")
    expect(method).toBe(DELETE)
    // When
    const response = await server.inject({ method, url })
    expect(response.statusCode).not.toBe(404)
  })
})

describe("FindTodoByIdRoute", () => {
  const url = "/api/todos/1"
  const method = GET

  test("Return is not a 404", async () => {
    // Given
    expect(url).toBe("/api/todos/1")
    expect(method).toBe(GET)
    // When
    const response = await server.inject({ method, url })
    // Then
    expect(response.statusCode).not.toBe(404)
  })
})

describe("FindTodosByTaskIdRoute", () => {
  const url = "/api/todos/task/1"
  const method = GET

  test("Return is not a 404", async () => {
    // Given
    expect(url).toBe("/api/todos/task/1")
    expect(method).toBe(GET)
    // When
    const response = await server.inject({ method, url })
    expect(response.statusCode).not.toBe(404)
  })
})

describe("SetTodoAsDoneRoute", () => {
  const url = "/api/todos/setdone/1"
  const method = PATCH

  test("Return is not a 404", async () => {
    // Given
    expect(url).toBe("/api/todos/setdone/1")
    expect(method).toBe(PATCH)
    // When
    const response = await server.inject({ method, url })
    // Then
    expect(response.statusCode).not.toBe(404)
  })
})

describe("SetTodoAsNotDone", () => {
  const url = "/api/todos/setnotdone/1"
  const method = PATCH

  test("Return is not a 404", async () => {
    // Given
    expect(url).toBe("/api/todos/setnotdone/1")
    expect(method).toBe(PATCH)
    // When
    const response = await server.inject({ method, url })
    // Then
    expect(response.statusCode).not.toBe(404)
  })
})

describe("UpdateTodoRoute", () => {
  const url = "/api/todos/1"
  const method = PUT

  test("Return in not a 404", async () => {
    // Given
    expect(url).toBe("/api/todos/1")
    expect(method).toBe(PUT)
    // When
    const response = await server.inject({ method, url })
    // Then
    expect(response.statusCode).not.toBe(404)
  })
})
