import { FastifyInstance } from "fastify"
import "jest-extended"

import { buildTestServerWithTasksRoutes } from "../../../utils/server/fastify-test.server"

import { CreateTaskBody, TaskBody } from "../../../../src/domain/types/controller/body.types"

const headers = { authentication_token: "TOKEN" }

let server: FastifyInstance

beforeAll(() => {
  server = buildTestServerWithTasksRoutes()
})

afterAll(() => {
  server.close()
})

describe("CreateTaskRoute", () => {
  test("Return is not a 404", async () => {
    const response = await server.inject({ method: "POST", url: "/api/tasks" })
    expect(response.statusCode).not.toBe(404)
  })

  test("Without body to return 400 and message", async () => {
    const response = await server.inject({ method: "POST", url: "/api/tasks", headers })
    expect(response.statusCode).toBe(400)
    expect(response.payload).toBeTruthy()
    expect(typeof response.payload === "string").toBeTrue()
  })

  test("Without authentication headers to return 401", async () => {
    const body: CreateTaskBody = { name: "TaskName", description: "TaskDescription" }
    const response = await server.inject({ method: "POST", url: "/api/tasks", payload: body })
    expect(response.statusCode).toBe(401)
    expect(response.payload).toBeTruthy()
    expect(typeof response.payload === "string").toBeTrue()
  })

  test("With body and authentication headers return 201 or 500", async () => {
    const body: CreateTaskBody = { name: "TaskName", description: "TaskDescription" }
    const response = await server.inject({
      method: "POST",
      url: "/api/tasks",
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

describe("DeleteTaskRoute", () => {
  test("Return is not a 404", async () => {
    const response = await server.inject({ method: "DELETE", url: "/api/tasks/1" })
    expect(response.statusCode).not.toBe(404)
  })

  test("Withoud taskId as param returns 400 and message", async () => {
    const response = await server.inject({ method: "DELETE", url: "/api/tasks/", headers })
    expect(response.statusCode).toBe(400)
    expect(response.payload).toBeTruthy()
    expect(typeof response.payload === "string").toBeTrue()
  })

  test("Without authentication headers to return 401 and message", async () => {
    const response = await server.inject({ method: "DELETE", url: "/api/tasks/1" })
    expect(response.statusCode).toBe(401)
    expect(response.payload).toBeTruthy()
    expect(typeof response.payload === "string").toBeTrue()
  })

  test("With taskId and authentication headers return 204 or 500", async () => {
    const response = await server.inject({
      method: "DELETE",
      url: "/api/tasks/1",
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

describe("FindTaskByIdRoute", () => {
  test("Return is not a 404", async () => {
    const response = await server.inject({ method: "GET", url: "/api/tasks/1" })
    expect(response.statusCode).not.toBe(404)
  })

  test("Withoud taskId as param returns 400 and message", async () => {
    const response = await server.inject({ method: "GET", url: "/api/tasks/", headers })
    expect(response.statusCode).toBe(400)
    expect(response.payload).toBeTruthy()
    expect(typeof response.payload === "string").toBeTrue()
  })

  test("Without authentication headers to return 401 and message", async () => {
    const response = await server.inject({ method: "GET", url: "/api/tasks/1" })
    expect(response.statusCode).toBe(401)
    expect(response.payload).toBeTruthy()
    expect(typeof response.payload === "string").toBeTrue()
  })

  test("With taskId and authentication headers return 200 or 500", async () => {
    const response = await server.inject({
      method: "GET",
      url: "/api/tasks/1",
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

describe("FindTasksByUserIdRoute", () => {
  test("Return is not a 404", async () => {
    const response = await server.inject({ method: "GET", url: "/api/tasks/user/1" })
    expect(response.statusCode).not.toBe(404)
  })

  test("Withoud userId as param returns 400 and message", async () => {
    const response = await server.inject({ method: "GET", url: "/api/tasks/user/", headers })
    expect(response.statusCode).toBe(400)
    expect(response.payload).toBeTruthy()
    expect(typeof response.payload === "string").toBeTrue()
  })

  test("Without authentication headers to return 401 and message", async () => {
    const response = await server.inject({ method: "GET", url: "/api/tasks/user/1" })
    expect(response.statusCode).toBe(401)
    expect(response.payload).toBeTruthy()
    expect(typeof response.payload === "string").toBeTrue()
  })

  test("With userId and authentication headers return 200 or 500", async () => {
    const response = await server.inject({
      method: "GET",
      url: "/api/tasks/user/1",
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

describe("UpdateTaskRoute", () => {
  test("Return in not a 404", async () => {
    const response = await server.inject({ method: "PUT", url: "/api/tasks/1" })
    expect(response.statusCode).not.toBe(404)
  })

  test("Withoud taskId as param returns 400 and message", async () => {
    const body: CreateTaskBody = { name: "TaskName", description: "TaskDescription" }
    const response = await server.inject({
      method: "PUT",
      url: "/api/tasks/",
      payload: body,
      headers
    })
    expect(response.statusCode).toBe(400)
    expect(response.payload).toBeTruthy()
    expect(typeof response.payload === "string").toBeTrue()
  })

  test("Without body to return 400 and message", async () => {
    const response = await server.inject({ method: "PUT", url: "/api/tasks/1", headers })
    expect(response.statusCode).toBe(400)
    expect(response.payload).toBeTruthy()
    expect(typeof response.payload === "string").toBeTrue()
  })

  test("Without authentication headers to return 401 and message", async () => {
    const body: CreateTaskBody = { name: "TaskName", description: "TaskDescription" }
    const response = await server.inject({ method: "PUT", url: "/api/tasks/1", payload: body })
    expect(response.statusCode).toBe(401)
    expect(response.payload).toBeTruthy()
    expect(typeof response.payload === "string").toBeTrue()
  })

  test("With taskId and authentication headers return 204 or 500", async () => {
    const body: CreateTaskBody = { name: "TaskName", description: "TaskDescription" }
    const response = await server.inject({
      method: "PUT",
      url: "/api/tasks/1",
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
