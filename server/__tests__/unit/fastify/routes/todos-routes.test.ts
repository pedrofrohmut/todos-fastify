import { buildTestServerWithAllRoutes } from "../../../utils/server/fastify-test.server"

describe("[ROUTES] Todos", () => {
  const server = buildTestServerWithAllRoutes()

  afterAll(() => {
    server.close()
  })

  test("[Route] Clear Complete Todos By Task Id", async () => {
    const response = await server.inject({ method: "DELETE", url: "/api/todos/task/1" })
    expect(response.statusCode).not.toBe(404)
  })

  test("[Route] Create Todo", async () => {
    const response = await server.inject({ method: "POST", url: "/api/todos" })
    expect(response.statusCode).not.toBe(404)
  })

  test("[Route] Delete Todo", async () => {
    const response = await server.inject({ method: "DELETE", url: "/api/todos/1" })
    expect(response.statusCode).not.toBe(404)
  })

  test("[Route] Find Todo By Id", async () => {
    const response = await server.inject({ method: "GET", url: "/api/todos/1" })
    expect(response.statusCode).not.toBe(404)
  })

  test("[Route] Find Todos By Task Id", async () => {
    const response = await server.inject({ method: "GET", url: "/api/todos/task/1" })
    expect(response.statusCode).not.toBe(404)
  })

  test("[Route] Set Todo As Done", async () => {
    const response = await server.inject({ method: "PATCH", url: "/api/todos/setdone/1" })
    expect(response.statusCode).not.toBe(404)
  })

  test("[Route] Set Todo As Not Done", async () => {
    const response = await server.inject({ method: "PATCH", url: "/api/todos/setnotdone/1" })
    expect(response.statusCode).not.toBe(404)
  })

  test("[Route] Update Todo", async () => {
    const response = await server.inject({ method: "PUT", url: "/api/todos/1" })
    expect(response.statusCode).not.toBe(404)
  })
})
