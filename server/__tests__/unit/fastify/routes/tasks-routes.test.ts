import { FastifyInstance } from "fastify"
import "jest-extended"

import { buildTestServerWithTasksRoutes } from "../../../utils/server/fastify-test.server"

import { CreateTaskBody, UpdateTaskBody } from "../../../../src/domain/types/controller/body.types"

const headers = { authentication_token: "TOKEN" }
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
  const body: CreateTaskBody = {
    name: "TaskName",
    description: "TaskDescription",
    userId: "userId"
  }

  test("Return is not a 404", async () => {
    // Given
    expect(url).toBe("/api/tasks")
    expect(method).toBe(POST)
    // When
    const response = await server.inject({ method, url })
    // Then
    expect(response.statusCode).not.toBe(404)
  })

  test("Without body to return 400 and message", async () => {
    // Given
    expect(url).toBe("/api/tasks")
    expect(method).toBe(POST)
    expect(headers).toEqual({ authentication_token: "TOKEN" })
    // When
    const response = await server.inject({ method, url, headers })
    // Then
    expect(response.statusCode).toBe(400)
    expect(response.payload).toBeTruthy()
    expect(typeof response.payload === "string").toBeTrue()
  })

  test("Without authentication headers to return 401", async () => {
    // Given
    expect(url).toBe("/api/tasks")
    expect(method).toBe(POST)
    expect(body).toEqual({ name: "TaskName", description: "TaskDescription", userId: "userId" })
    // When
    const response = await server.inject({ method, url, payload: body })
    // Then
    expect(response.statusCode).toBe(401)
    expect(response.payload).toBeTruthy()
    expect(typeof response.payload === "string").toBeTrue()
  })

  test("With body and authentication headers return 201 or 500", async () => {
    // Given
    expect(url).toBe("/api/tasks")
    expect(method).toBe(POST)
    expect(body).toEqual({ name: "TaskName", description: "TaskDescription", userId: "userId" })
    expect(headers).toEqual({ authentication_token: "TOKEN" })
    // When
    const response = await server.inject({ method, url, payload: body, headers })
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

  test("Withoud taskId as param returns 400 and message", async () => {
    const url = "/api/tasks/"
    // Given
    expect(url).toBe("/api/tasks/")
    expect(method).toBe(DELETE)
    expect(headers).toEqual({ authentication_token: "TOKEN" })
    // When
    const response = await server.inject({ method, url, headers })
    // Then
    expect(response.statusCode).toBe(400)
    expect(response.payload).toBeTruthy()
    expect(typeof response.payload === "string").toBeTrue()
  })

  test("Without authentication headers to return 401 and message", async () => {
    // Given
    expect(url).toBe("/api/tasks/1")
    expect(method).toBe(DELETE)
    // When
    const response = await server.inject({ method, url })
    // Then
    expect(response.statusCode).toBe(401)
    expect(response.payload).toBeTruthy()
    expect(typeof response.payload === "string").toBeTrue()
  })

  test("With taskId and authentication headers return 204 or 500", async () => {
    // Given
    expect(url).toBe("/api/tasks/1")
    expect(method).toBe(DELETE)
    expect(headers).toEqual({ authentication_token: "TOKEN" })
    // When
    const response = await server.inject({ method, url, headers })
    // Then
    expect(response.statusCode).toBeOneOf([204, 500])
    if (response.statusCode === 204) {
      expect(response.payload).toBeFalsy()
    }
    if (response.statusCode === 500) {
      expect(response.payload).toBeTruthy()
      expect(typeof response.payload === "string").toBeTrue()
    }
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

  test("Withoud taskId as param returns 400 and message", async () => {
    const url = "/api/tasks/"
    // Given
    expect(url).toBe("/api/tasks/")
    expect(method).toBe(GET)
    expect(headers).toEqual({ authentication_token: "TOKEN" })
    // When
    const response = await server.inject({ method, url, headers })
    // Then
    expect(response.statusCode).toBe(400)
    expect(response.payload).toBeTruthy()
    expect(typeof response.payload === "string").toBeTrue()
  })

  test("Without authentication headers to return 401 and message", async () => {
    // Given
    expect(url).toBe("/api/tasks/1")
    expect(method).toBe(GET)
    // When
    const response = await server.inject({ method, url })
    // Then
    expect(response.statusCode).toBe(401)
    expect(response.payload).toBeTruthy()
    expect(typeof response.payload === "string").toBeTrue()
  })

  test("With taskId and authentication headers return 200 or 500", async () => {
    // Given
    expect(url).toBe("/api/tasks/1")
    expect(method).toBe(GET)
    expect(headers).toEqual({ authentication_token: "TOKEN" })
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

  test("Withoud userId as param returns 400 and message", async () => {
    const url = "/api/tasks/user/"
    // Given
    expect(url).toBe("/api/tasks/user/")
    expect(method).toBe(GET)
    expect(headers).toEqual({ authentication_token: "TOKEN" })
    // When
    const response = await server.inject({ method, url, headers })
    // Then
    expect(response.statusCode).toBe(400)
    expect(response.payload).toBeTruthy()
    expect(typeof response.payload === "string").toBeTrue()
  })

  test("Without authentication headers to return 401 and message", async () => {
    // Given
    expect(url).toBe("/api/tasks/user/1")
    expect(method).toBe(GET)
    // When
    const response = await server.inject({ method, url })
    // Then
    expect(response.statusCode).toBe(401)
    expect(response.payload).toBeTruthy()
    expect(typeof response.payload === "string").toBeTrue()
  })

  test("With userId and authentication headers return 200 or 500", async () => {
    // Given
    expect(url).toBe("/api/tasks/user/1")
    expect(method).toBe(GET)
    expect(headers).toEqual({ authentication_token: "TOKEN" })
    // When
    const response = await server.inject({ method, url, headers })
    // Then
    expect(response.statusCode).toBeOneOf([200, 500])
    expect(response.payload).toBeTruthy()
    if (response.statusCode === 200) {
      expect(Array.isArray(JSON.parse(response.payload))).toBeTrue()
    }
    if (response.statusCode === 500) {
      expect(typeof response.payload === "string").toBeTrue()
    }
  })
})

describe("UpdateTaskRoute", () => {
  const url = "/api/tasks/1"
  const method = PUT
  const body: UpdateTaskBody = { name: "TaskName", description: "TaskDescription" }

  test("Return in not a 404", async () => {
    // Given
    expect(url).toBe("/api/tasks/1")
    expect(method).toBe(PUT)
    // When
    const response = await server.inject({ method, url })
    // Then
    expect(response.statusCode).not.toBe(404)
  })

  test("Withoud taskId as param returns 400 and message", async () => {
    const url = "/api/tasks/"
    // Given
    expect(url).toBe("/api/tasks/")
    expect(method).toBe(PUT)
    expect(body).toEqual({ name: "TaskName", description: "TaskDescription" })
    expect(headers).toEqual({ authentication_token: "TOKEN" })
    // When
    const response = await server.inject({ method, url, payload: body, headers })
    // Then
    expect(response.statusCode).toBe(400)
    expect(response.payload).toBeTruthy()
    expect(typeof response.payload === "string").toBeTrue()
  })

  test("Without body to return 400 and message", async () => {
    // Given
    expect(url).toBe("/api/tasks/1")
    expect(method).toBe(PUT)
    expect(headers).toEqual({ authentication_token: "TOKEN" })
    // When
    const response = await server.inject({ method, url, headers })
    // Then
    expect(response.statusCode).toBe(400)
    expect(response.payload).toBeTruthy()
    expect(typeof response.payload === "string").toBeTrue()
  })

  test("Without authentication headers to return 401 and message", async () => {
    // Given
    expect(url).toBe("/api/tasks/1")
    expect(method).toBe(PUT)
    expect(body).toEqual({ name: "TaskName", description: "TaskDescription" })
    // When
    const response = await server.inject({ method, url, payload: body })
    // Then
    expect(response.statusCode).toBe(401)
    expect(response.payload).toBeTruthy()
    expect(typeof response.payload === "string").toBeTrue()
  })

  test("With taskId and authentication headers return 204 or 500", async () => {
    // Given
    expect(url).toBe("/api/tasks/1")
    expect(method).toBe(PUT)
    expect(body).toEqual({ name: "TaskName", description: "TaskDescription" })
    expect(headers).toEqual({ authentication_token: "TOKEN" })
    // When
    const response = await server.inject({ method, url, payload: body, headers })
    // Then
    expect(response.statusCode).toBeOneOf([204, 500])
    if (response.statusCode === 204) {
      expect(response.payload).toBeFalsy()
    }
    if (response.statusCode === 500) {
      expect(response.payload).toBeTruthy()
      expect(typeof response.payload === "string").toBeTrue()
    }
  })
})
