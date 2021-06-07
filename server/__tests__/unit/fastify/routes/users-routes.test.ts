import { FastifyInstance } from "fastify"
import "jest-extended"

import { buildTestServerWithUsersRoutes } from "../../../utils/server/fastify-test.server"

import { CreateUserBody, SignInUserBody } from "../../../../src/domain/types/controller/body.types"

const headers = { authentication_token: "TOKEN" }

let server: FastifyInstance

beforeAll(() => {
  server = buildTestServerWithUsersRoutes()
})

afterAll(() => {
  server.close()
})

describe("CreateUserRoute", () => {
  test("Return is not a 404", async () => {
    const response = await server.inject({ method: "POST", url: "/api/users" })
    expect(response.statusCode).not.toBe(404)
  })

  test("Without body to return 400 and message", async () => {
    const response = await server.inject({ method: "POST", url: "/api/users" })
    expect(response.statusCode).toBe(400)
    expect(response.payload).toBeTruthy()
    expect(typeof response.payload === "string").toBeTrue()
  })

  test("With body return 201 or 500", async () => {
    const body: CreateUserBody = {
      name: "UserName",
      email: "user@email.com",
      password: "UserPassword"
    }
    const response = await server.inject({
      method: "POST",
      url: "/api/users",
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

describe("GetSignedUserRoute", () => {
  test("Return is not a 404", async () => {
    const response = await server.inject({ method: "GET", url: "/api/users/signed" })
    expect(response.statusCode).not.toBe(404)
  })

  test("Without authentication headers to return 401", async () => {
    const response = await server.inject({ method: "GET", url: "/api/users/signed" })
    expect(response.statusCode).toBe(401)
    expect(response.payload).toBeTruthy()
    expect(typeof response.payload === "string").toBeTrue()
  })

  test("With authentication headers return 200 or 500", async () => {
    const response = await server.inject({ method: "GET", url: "/api/users/signed", headers })
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
  test("Return is not a 404", async () => {
    const response = await server.inject({ method: "POST", url: "/api/users/signin" })
    expect(response.statusCode).not.toBe(404)
  })

  test("Without body to return 400 and message", async () => {
    const response = await server.inject({ method: "POST", url: "/api/users/signin" })
    expect(response.statusCode).toBe(400)
    expect(response.payload).toBeTruthy()
    expect(typeof response.payload === "string").toBeTrue()
  })

  test("With body return 200 or 500", async () => {
    const body: SignInUserBody = {
      email: "user@email.com",
      password: "UserPassword"
    }
    const response = await server.inject({
      method: "POST",
      url: "/api/users/signin",
      payload: body
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
