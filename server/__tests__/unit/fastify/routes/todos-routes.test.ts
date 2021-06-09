import { FastifyInstance } from "fastify"
import "jest-extended"
import { CreateTodoBody, UpdateTodoBody } from "../../../../src/domain/types/controller/body.types"

import { buildTestServerWithTodosRoutes } from "../../../utils/server/fastify-test.server"

const headers = { authentication_token: "TOKEN" }
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

  test("Withoud taskId as param returns 400 and message", async () => {
    const url = "/api/todos/task/"
    // Given
    expect(url).toBe("/api/todos/task/")
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
    expect(url).toBe("/api/todos/task/1")
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
    expect(url).toBe("/api/todos/task/1")
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

describe("CreateTodoRoute", () => {
  const url = "/api/todos"
  const method = POST
  const body: CreateTodoBody = {
    name: "TaskName",
    description: "TaskDescription",
    taskId: "TaskId",
    userId: "UserId"
  }

  test("Return is not a 404", async () => {
    // Given
    expect(url).toBe("/api/todos")
    expect(method).toBe(POST)
    // When
    const response = await server.inject({ method, url })
    // Then
    expect(response.statusCode).not.toBe(404)
  })

  test("Without body to return 400 and message", async () => {
    // Given
    expect(url).toBe("/api/todos")
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
    expect(url).toBe("/api/todos")
    expect(method).toBe(POST)
    expect(body).toEqual({
      name: "TaskName",
      description: "TaskDescription",
      taskId: "TaskId",
      userId: "UserId"
    })
    // When
    const response = await server.inject({ method, url, payload: body })
    // Then
    expect(response.statusCode).toBe(401)
    expect(response.payload).toBeTruthy()
    expect(typeof response.payload === "string").toBeTrue()
  })

  test("With body and authentication headers return 201 or 500", async () => {
    // Given
    expect(url).toBe("/api/todos")
    expect(method).toBe(POST)
    expect(body).toEqual({
      name: "TaskName",
      description: "TaskDescription",
      taskId: "TaskId",
      userId: "UserId"
    })
    expect(headers).toEqual({ authentication_token: "TOKEN" })
    // When
    const response = await server.inject({
      method: "POST",
      url: "/api/todos",
      payload: body,
      headers
    })
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

  test("Withoud taskId as param returns 400 and message", async () => {
    const url = "/api/todos/"
    // Given
    expect(url).toBe("/api/todos/")
    expect(method).toBe(DELETE)
    // When
    const response = await server.inject({ method, url, headers })
    // Then
    expect(response.statusCode).toBe(400)
    expect(response.payload).toBeTruthy()
    expect(typeof response.payload === "string").toBeTrue()
  })

  test("Without authentication headers to return 401 and message", async () => {
    // Given
    expect(url).toBe("/api/todos/1")
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
    expect(url).toBe("/api/todos/1")
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

  test("Withoud todoId as param returns 400 and message", async () => {
    const url = "/api/todos/"
    // Given
    expect(url).toBe("/api/todos/")
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
    expect(url).toBe("/api/todos/1")
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
    expect(url).toBe("/api/todos/1")
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

  test("Withoud taskId as param returns 400 and message", async () => {
    const url = "/api/todos/task/"
    // Given
    expect(url).toBe("/api/todos/task/")
    expect(method).toBe(GET)
    expect(headers).toEqual({ authentication_token: "TOKEN" })
    // When
    const response = await server.inject({ method: "GET", url: "/api/todos/task/", headers })
    // Then
    expect(response.statusCode).toBe(400)
    expect(response.payload).toBeTruthy()
    expect(typeof response.payload === "string").toBeTrue()
  })

  test("Without authentication headers to return 401 and message", async () => {
    // Given
    expect(url).toBe("/api/todos/task/1")
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
    expect(url).toBe("/api/todos/task/1")
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

  test("Withoud todoId as param returns 400 and message", async () => {
    const url = "/api/todos/setdone/"
    // Given
    expect(url).toBe("/api/todos/setdone/")
    expect(method).toBe(PATCH)
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
    expect(url).toBe("/api/todos/setdone/1")
    expect(method).toBe(PATCH)
    // When
    const response = await server.inject({ method, url })
    // Then
    expect(response.statusCode).toBe(401)
    expect(response.payload).toBeTruthy()
    expect(typeof response.payload === "string").toBeTrue()
  })

  test("With todoId and authentication headers return 204 or 500", async () => {
    // Given
    expect(url).toBe("/api/todos/setdone/1")
    expect(method).toBe(PATCH)
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

  test("Withoud todoId as param returns 400 and message", async () => {
    const url = "/api/todos/setnotdone/"
    // Given
    expect(url).toBe("/api/todos/setnotdone/")
    expect(method).toBe(PATCH)
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
    expect(url).toBe("/api/todos/setnotdone/1")
    expect(method).toBe(PATCH)
    // When
    const response = await server.inject({ method, url })
    // Then
    expect(response.statusCode).toBe(401)
    expect(response.payload).toBeTruthy()
    expect(typeof response.payload === "string").toBeTrue()
  })

  test("With todoId and authentication headers return 204 or 500", async () => {
    // Given
    expect(url).toBe("/api/todos/setnotdone/1")
    expect(method).toBe(PATCH)
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

describe("UpdateTodoRoute", () => {
  const url = "/api/todos/1"
  const method = PUT
  const body: UpdateTodoBody = { name: "TodoName", description: "TodoDescription", isDone: false }

  test("Return in not a 404", async () => {
    // Given
    expect(url).toBe("/api/todos/1")
    expect(method).toBe(PUT)
    // When
    const response = await server.inject({ method, url })
    // Then
    expect(response.statusCode).not.toBe(404)
  })

  test("Withoud todoId as param returns 400 and message", async () => {
    const url = "/api/todos/"
    // Given
    expect(url).toBe("/api/todos/")
    expect(method).toBe(PUT)
    expect(body).toEqual({ name: "TodoName", description: "TodoDescription", isDone: false })
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
    expect(url).toBe("/api/todos/1")
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
    expect(url).toBe("/api/todos/1")
    expect(method).toBe(PUT)
    expect(body).toEqual({ name: "TodoName", description: "TodoDescription", isDone: false })
    // When
    const response = await server.inject({ method, url, payload: body })
    // Then
    expect(response.statusCode).toBe(401)
    expect(response.payload).toBeTruthy()
    expect(typeof response.payload === "string").toBeTrue()
  })

  test("With todoId and authentication headers return 204 or 500", async () => {
    // Given
    expect(url).toBe("/api/todos/1")
    expect(method).toBe(PUT)
    expect(body).toEqual({ name: "TodoName", description: "TodoDescription", isDone: false })
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
