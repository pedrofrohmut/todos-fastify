import { buildTestServerWithAllRoutes } from "../../../utils/server/fastify-test.server"

describe("[ROUTES] Users", () => {
  const server = buildTestServerWithAllRoutes()

  afterAll(() => {
    server.close()
  })

  test("[Route] Create User", async () => {
    const response = await server.inject({ method: "POST", url: "/api/users" })
    expect(response.statusCode).not.toBe(404)
  })

  test("[Route] Get Signed User", async () => {
    const response = await server.inject({ method: "GET", url: "/api/users/signed" })
    expect(response.statusCode).not.toBe(404)
  })

  test("[Route] Sign In User", async () => {
    const response = await server.inject({ method: "POST", url: "/api/users/signin" })
    expect(response.statusCode).not.toBe(404)
  })
})
