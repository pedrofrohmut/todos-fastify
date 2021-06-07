import { FastifyInstance } from "fastify"
import "jest-extended"
import { CreateTodoBody } from "../../../../src/domain/types/controller/body.types"

import { buildTestServerWithTodosRoutes } from "../../../utils/server/fastify-test.server"

const headers = { authentication_token: "TOKEN" }

let server: FastifyInstance

beforeAll(() => {
  server = buildTestServerWithTodosRoutes()
})

afterAll(() => {
  server.close()
})

describe("ClearCompleteTodosByTaskIdRoute", () => {
  test("Return is not a 404", async () => {
    const response = await server.inject({ method: "DELETE", url: "/api/todos/task/1" })
    expect(response.statusCode).not.toBe(404)
  })

  test("Withoud taskId as param returns 400 and message", async () => {
    const response = await server.inject({ method: "DELETE", url: "/api/todos/task/", headers })
    expect(response.statusCode).toBe(400)
    expect(response.payload).toBeTruthy()
    expect(typeof response.payload === "string").toBeTrue()
  })

  test("Without authentication headers to return 401 and message", async () => {
    const response = await server.inject({ method: "DELETE", url: "/api/todos/task/1" })
    expect(response.statusCode).toBe(401)
    expect(response.payload).toBeTruthy()
    expect(typeof response.payload === "string").toBeTrue()
  })

  test("With taskId and authentication headers return 204 or 500", async () => {
    const response = await server.inject({
      method: "DELETE",
      url: "/api/todos/task/1",
      headers
    })
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
  test("Return is not a 404", async () => {
    const response = await server.inject({ method: "POST", url: "/api/todos" })
    expect(response.statusCode).not.toBe(404)
  })

  test("Without body to return 400 and message", async () => {
    const response = await server.inject({ method: "POST", url: "/api/todos", headers })
    expect(response.statusCode).toBe(400)
    expect(response.payload).toBeTruthy()
    expect(typeof response.payload === "string").toBeTrue()
  })

  test("Without authentication headers to return 401", async () => {
    const body: CreateTodoBody = { name: "TaskName", description: "TaskDescription" }
    const response = await server.inject({ method: "POST", url: "/api/todos", payload: body })
    expect(response.statusCode).toBe(401)
    expect(response.payload).toBeTruthy()
    expect(typeof response.payload === "string").toBeTrue()
  })

  test("With body and authentication headers return 201 or 500", async () => {
    const body: CreateTodoBody = { name: "TaskName", description: "TaskDescription" }
    const response = await server.inject({
      method: "POST",
      url: "/api/todos",
      payload: body,
      headers
    })
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
  test("Return is not a 404", async () => {
    const response = await server.inject({ method: "DELETE", url: "/api/todos/1" })
    expect(response.statusCode).not.toBe(404)
  })

  test("Withoud taskId as param returns 400 and message", async () => {
    const response = await server.inject({ method: "DELETE", url: "/api/todos/", headers })
    expect(response.statusCode).toBe(400)
    expect(response.payload).toBeTruthy()
    expect(typeof response.payload === "string").toBeTrue()
  })

  test("Without authentication headers to return 401 and message", async () => {
    const response = await server.inject({ method: "DELETE", url: "/api/todos/1" })
    expect(response.statusCode).toBe(401)
    expect(response.payload).toBeTruthy()
    expect(typeof response.payload === "string").toBeTrue()
  })

  test("With taskId and authentication headers return 204 or 500", async () => {
    const response = await server.inject({
      method: "DELETE",
      url: "/api/todos/1",
      headers
    })
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
  test("Return is not a 404", async () => {
    const response = await server.inject({ method: "GET", url: "/api/todos/1" })
    expect(response.statusCode).not.toBe(404)
  })

  test("Withoud todoId as param returns 400 and message", async () => {
    const response = await server.inject({ method: "GET", url: "/api/todos/", headers })
    expect(response.statusCode).toBe(400)
    expect(response.payload).toBeTruthy()
    expect(typeof response.payload === "string").toBeTrue()
  })

  test("Without authentication headers to return 401 and message", async () => {
    const response = await server.inject({ method: "GET", url: "/api/todos/1" })
    expect(response.statusCode).toBe(401)
    expect(response.payload).toBeTruthy()
    expect(typeof response.payload === "string").toBeTrue()
  })

  test("With taskId and authentication headers return 200 or 500", async () => {
    const response = await server.inject({
      method: "GET",
      url: "/api/todos/1",
      headers
    })
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
  test("Return is not a 404", async () => {
    const response = await server.inject({ method: "GET", url: "/api/todos/task/1" })
    expect(response.statusCode).not.toBe(404)
  })

  test("Withoud taskId as param returns 400 and message", async () => {
    const response = await server.inject({ method: "GET", url: "/api/todos/task/", headers })
    expect(response.statusCode).toBe(400)
    expect(response.payload).toBeTruthy()
    expect(typeof response.payload === "string").toBeTrue()
  })

  test("Without authentication headers to return 401 and message", async () => {
    const response = await server.inject({ method: "GET", url: "/api/todos/task/1" })
    expect(response.statusCode).toBe(401)
    expect(response.payload).toBeTruthy()
    expect(typeof response.payload === "string").toBeTrue()
  })

  test("With taskId and authentication headers return 200 or 500", async () => {
    const response = await server.inject({
      method: "GET",
      url: "/api/todos/task/1",
      headers
    })
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
  test("Return is not a 404", async () => {
    const response = await server.inject({ method: "PATCH", url: "/api/todos/setdone/1" })
    expect(response.statusCode).not.toBe(404)
  })

  test("Withoud todoId as param returns 400 and message", async () => {
    const response = await server.inject({ method: "PATCH", url: "/api/todos/setdone/", headers })
    expect(response.statusCode).toBe(400)
    expect(response.payload).toBeTruthy()
    expect(typeof response.payload === "string").toBeTrue()
  })

  test("Without authentication headers to return 401 and message", async () => {
    const response = await server.inject({ method: "PATCH", url: "/api/todos/setdone/1" })
    expect(response.statusCode).toBe(401)
    expect(response.payload).toBeTruthy()
    expect(typeof response.payload === "string").toBeTrue()
  })

  test("With todoId and authentication headers return 204 or 500", async () => {
    const response = await server.inject({
      method: "PATCH",
      url: "/api/todos/setdone/1",
      headers
    })
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
  test("Return is not a 404", async () => {
    const response = await server.inject({ method: "PATCH", url: "/api/todos/setnotdone/1" })
    expect(response.statusCode).not.toBe(404)
  })

  test("Withoud todoId as param returns 400 and message", async () => {
    const response = await server.inject({
      method: "PATCH",
      url: "/api/todos/setnotdone/",
      headers
    })
    expect(response.statusCode).toBe(400)
    expect(response.payload).toBeTruthy()
    expect(typeof response.payload === "string").toBeTrue()
  })

  test("Without authentication headers to return 401 and message", async () => {
    const response = await server.inject({ method: "PATCH", url: "/api/todos/setnotdone/1" })
    expect(response.statusCode).toBe(401)
    expect(response.payload).toBeTruthy()
    expect(typeof response.payload === "string").toBeTrue()
  })

  test("With todoId and authentication headers return 204 or 500", async () => {
    const response = await server.inject({
      method: "PATCH",
      url: "/api/todos/setnotdone/1",
      headers
    })
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
  test("Return in not a 404", async () => {
    const response = await server.inject({ method: "PUT", url: "/api/todos/1" })
    expect(response.statusCode).not.toBe(404)
  })

  test("Withoud todoId as param returns 400 and message", async () => {
    const body: CreateTodoBody = { name: "TodoName", description: "TodoDescription" }
    const response = await server.inject({
      method: "PUT",
      url: "/api/todos/",
      payload: body,
      headers
    })
    expect(response.statusCode).toBe(400)
    expect(response.payload).toBeTruthy()
    expect(typeof response.payload === "string").toBeTrue()
  })

  test("Without body to return 400 and message", async () => {
    const response = await server.inject({ method: "PUT", url: "/api/todos/1", headers })
    expect(response.statusCode).toBe(400)
    expect(response.payload).toBeTruthy()
    expect(typeof response.payload === "string").toBeTrue()
  })

  test("Without authentication headers to return 401 and message", async () => {
    const body: CreateTodoBody = { name: "TodoName", description: "TodoDescription" }
    const response = await server.inject({ method: "PUT", url: "/api/todos/1", payload: body })
    expect(response.statusCode).toBe(401)
    expect(response.payload).toBeTruthy()
    expect(typeof response.payload === "string").toBeTrue()
  })

  test("With todoId and authentication headers return 204 or 500", async () => {
    const body: CreateTodoBody = { name: "TodoName", description: "TodoDescription" }
    const response = await server.inject({
      method: "PUT",
      url: "/api/todos/1",
      payload: body,
      headers
    })
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
